

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "web_app";


ALTER SCHEMA "web_app" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."assign_init_roles"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_buyer_role_id uuid;
  v_traveler_role_id uuid;
begin

  select *
  into v_buyer_role_id, v_traveler_role_id
  from (
    select
      (select id from web_app.roles where name = 'buyer') as buyer_id,
      (select id from web_app.roles where name = 'traveler') as traveler_id
  ) as role_ids;

  if v_buyer_role_id is null or v_traveler_role_id is null then
    raise exception 'Uno de los roles no fue encontrado';
  end if;


  insert into web_app.user_roles (user_id, role_id)
  values
    (new.id, v_buyer_role_id),
    (new.id, v_traveler_role_id);

  return new;
end;
$$;


ALTER FUNCTION "web_app"."assign_init_roles"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."expire_old_grabs"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    updated_count integer;
BEGIN
    WITH updated AS (
        UPDATE web_app.grabs
        SET status = 'EXPIRED'
        WHERE delivery_deadline < CURRENT_DATE
        AND status != 'EXPIRED'
        RETURNING 1
    )
    SELECT COUNT(*) INTO updated_count FROM updated;
    
    RAISE NOTICE 'Expired % grab(s) with passed delivery deadline', updated_count;
    RETURN updated_count;
END;
$$;


ALTER FUNCTION "web_app"."expire_old_grabs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."expire_traveler_trips"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'web_app', 'extensions'
    AS $$
declare
  _count integer := 0;
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'web_app' and table_name = 'traveler_trips'
  ) then
    return 0;
  end if;

  with updated as (
    update web_app.traveler_trips
       set status = 'EXPIRED'
     where status = 'CONFIRMED'
       and departure_date <= (current_date + integer '1')
    returning 1
  )
  select count(*) into _count from updated;
  return _count;
end;
$$;


ALTER FUNCTION "web_app"."expire_traveler_trips"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."get_next_future_trips"() RETURNS TABLE("traveler_id" "uuid", "country_origin_name" "text", "country_origin_code" character, "country_destination_name" "text", "country_destination_code" character, "departure_date" "date", "departure_date_formated" "text", "total_grabs" bigint, "grab_ids" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
 RETURN QUERY
      select tr.traveler_id,
       co.name as country_origin_name,
       co.iso_code as country_origin_code,
       cd.name as country_destination_name,
       cd.iso_code as country_destination_code,
       tr.departure_date,
       to_char(tr.departure_date, 'DD "de" FMMonth "de" YYYY') as departure_date_formated,
       count(g.id) as total_grabs,
       array_to_string(array_remove(array_agg(g.id), null), ',') as grab_ids
from web_app.traveler_trips tr
join web_app.countries co on tr.country_origin_id = co.id
join web_app.countries cd on tr.country_destination_id = cd.id
left join web_app.grabs g
       on g.status = 'PUBLISHED'
      and (
           -- Caso I: sin retorno
           (tr.return_date is null 
            and g.country_origin_id = tr.country_origin_id 
            and tr.departure_date <= g.delivery_deadline)

           -- Caso II: con retorno
        or (tr.return_date is not null 
            and g.country_origin_id = tr.country_destination_id
            and tr.return_date <= g.delivery_deadline)
      )
where tr.departure_date >= now()
group by tr.traveler_id, co.name, co.iso_code, cd.name, cd.iso_code, tr.departure_date;

END;
$$;


ALTER FUNCTION "web_app"."get_next_future_trips"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_first_name text;
  v_last_name text;
  v_words text[];
  v_word_count int;
begin
  v_first_name := coalesce(
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'name'
  );
  v_last_name := new.raw_user_meta_data ->> 'last_name';

  -- Si v_first_name es NULL, evitar error al hacer split
  if v_first_name is not null then
    v_words := regexp_split_to_array(v_first_name, '\s+');
    v_word_count := array_length(v_words, 1);

    if v_word_count = 2 then
      v_first_name := v_words[1];
      v_last_name := v_words[2];
    end if;
  end if;

  insert into web_app.users (
    id, 
    first_name,
    last_name,
    email
  )
  values (
    new.id,
    v_first_name,
    v_last_name,
    new.email
  );
  return new;
end;
$$;


ALTER FUNCTION "web_app"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "web_app"."process_expired_grabs"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    result integer;
BEGIN
    SELECT web_app.expire_old_grabs() INTO result;
    RETURN result;
END;
$$;


ALTER FUNCTION "web_app"."process_expired_grabs"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "web_app"."countries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "iso_code" character(2) NOT NULL,
    "name" "text" NOT NULL,
    "continent" "text",
    "currency_code" character(3),
    "flag_emoji" character(2),
    "phone_code" "text",
    "flag_image_url" "text" DEFAULT 'https://flagcdn.com/w80/{code}.png'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "web_app"."countries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."grabs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buyer_id" "uuid",
    "product_url" "text" NOT NULL,
    "product_title" "text" NOT NULL,
    "price_estimated" numeric(10,2),
    "quantity" integer DEFAULT 1,
    "description" "text",
    "has_original_packaging" boolean DEFAULT false,
    "country_origin_id" "uuid",
    "country_destination_id" "uuid",
    "delivery_deadline" "date",
    "status" "text" DEFAULT 'PUBLISHED'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "product_image" "text"
);


ALTER TABLE "web_app"."grabs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "grab_id" "uuid",
    "traveler_id" "uuid",
    "buyer_id" "uuid",
    "agreed_price" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "payment_status" "text" DEFAULT 'unpaid'::"text",
    "delivery_date_estimated" "date",
    "tracking_info" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "web_app"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    CONSTRAINT "roles_name_check" CHECK (("name" = ANY (ARRAY['buyer'::"text", 'traveler'::"text"])))
);


ALTER TABLE "web_app"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."traveler_trips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "traveler_id" "uuid" NOT NULL,
    "country_origin_id" "uuid" NOT NULL,
    "country_destination_id" "uuid" NOT NULL,
    "departure_date" "date" NOT NULL,
    "return_date" "date",
    "current_capacity" integer DEFAULT 0,
    "max_weight_kg" numeric(5,2),
    "max_items" integer,
    "status" "text" DEFAULT 'CONFIRMED'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "web_app"."traveler_trips" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL
);


ALTER TABLE "web_app"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "web_app"."users" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "web_app"."users" OWNER TO "postgres";


ALTER TABLE ONLY "web_app"."countries"
    ADD CONSTRAINT "countries_iso_code_key" UNIQUE ("iso_code");



ALTER TABLE ONLY "web_app"."countries"
    ADD CONSTRAINT "countries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "web_app"."grabs"
    ADD CONSTRAINT "grabs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "web_app"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "web_app"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "web_app"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "web_app"."traveler_trips"
    ADD CONSTRAINT "traveler_trips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "web_app"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");



ALTER TABLE ONLY "web_app"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "on_assign_init_roles" AFTER INSERT ON "web_app"."users" FOR EACH ROW EXECUTE FUNCTION "web_app"."assign_init_roles"();



ALTER TABLE ONLY "web_app"."grabs"
    ADD CONSTRAINT "grabs_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "web_app"."grabs"
    ADD CONSTRAINT "grabs_country_destination_id_fkey" FOREIGN KEY ("country_destination_id") REFERENCES "web_app"."countries"("id");



ALTER TABLE ONLY "web_app"."grabs"
    ADD CONSTRAINT "grabs_country_origin_id_fkey" FOREIGN KEY ("country_origin_id") REFERENCES "web_app"."countries"("id");



ALTER TABLE ONLY "web_app"."orders"
    ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "web_app"."orders"
    ADD CONSTRAINT "orders_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "web_app"."traveler_trips"
    ADD CONSTRAINT "traveler_trips_country_destination_id_fkey" FOREIGN KEY ("country_destination_id") REFERENCES "web_app"."countries"("id");



ALTER TABLE ONLY "web_app"."traveler_trips"
    ADD CONSTRAINT "traveler_trips_country_origin_id_fkey" FOREIGN KEY ("country_origin_id") REFERENCES "web_app"."countries"("id");



ALTER TABLE ONLY "web_app"."traveler_trips"
    ADD CONSTRAINT "traveler_trips_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "web_app"."users"("id");



ALTER TABLE ONLY "web_app"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "web_app"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow user access to own trips" ON "web_app"."traveler_trips" USING (("traveler_id" = "auth"."uid"()));



ALTER TABLE "web_app"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "web_app"."traveler_trips" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "web_app"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "web_app"."users" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "web_app" TO "authenticated";
GRANT USAGE ON SCHEMA "web_app" TO "service_role";
GRANT USAGE ON SCHEMA "web_app" TO "anon";



GRANT ALL ON FUNCTION "web_app"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "web_app"."handle_new_user"() TO "authenticated";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."countries" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."countries" TO "anon";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."grabs" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."grabs" TO "anon";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."orders" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."orders" TO "authenticated";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."roles" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."roles" TO "authenticated";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."traveler_trips" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."traveler_trips" TO "anon";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."user_roles" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."user_roles" TO "authenticated";



GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."users" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "web_app"."users" TO "authenticated";



RESET ALL;