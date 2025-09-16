-- Insert countries if they don't exist
INSERT INTO web_app.countries (id, iso_code, name, continent, currency_code, flag_emoji, phone_code, flag_image_url, created_at)
VALUES 
    ('aaf80eef-b0e0-45d8-8436-c2a3806399a4', 'US', 'Estados Unidos', 'América', 'USD', '🇺🇸', '+1', 'https://flagcdn.com/w80/{code}.png', '2025-05-09 15:07:38.239242+00'),
    ('4fde8fa8-f94b-402a-9267-c122b202ff30', 'AR', 'Argentina', 'América', 'ARS', '🇦🇷', '+54', 'https://flagcdn.com/w80/{code}.png', '2025-05-09 15:07:38.239242+00'),
    ('d2cd7202-d28c-4221-a4ec-b4cca0416e54', 'BR', 'Brasil', 'América', 'BRL', '🇧🇷', '+55', 'https://flagcdn.com/w80/{code}.png', '2025-05-09 15:07:38.239242+00'),
    ('f3763bdd-3220-4f14-9ac2-b9f37726c3c6', 'CO', 'Colombia', 'América', 'COP', '🇨🇴', '+57', 'https://flagcdn.com/w80/{code}.png', '2025-05-09 15:07:38.239242+00')
ON CONFLICT (iso_code) DO NOTHING;
