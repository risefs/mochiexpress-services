-- Insert roles if they don't exist
INSERT INTO web_app.roles (name)
SELECT 'traveler'
WHERE NOT EXISTS (
    SELECT 1 FROM web_app.roles WHERE name = 'traveler'
);

INSERT INTO web_app.roles (name)
SELECT 'buyer'
WHERE NOT EXISTS (
    SELECT 1 FROM web_app.roles WHERE name = 'buyer'
);