ALTER TABLE web_app.grabs RENAME COLUMN buyer_id TO user_id;

ALTER TABLE web_app.grabs ADD CONSTRAINT grabs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id);

ALTER TABLE web_app.grabs DROP CONSTRAINT IF EXISTS grabs_buyer_id_fkey;
