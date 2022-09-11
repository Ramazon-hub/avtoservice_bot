ALTER TABLE users
    ADD COLUMN lang VARCHAR;
$$
ALTER TABLE users
    ADD COLUMN first_name VARCHAR,
    ADD COLUMN last_name VARCHAR,
    ADD COLUMN username VARCHAR,
    DROP COLUMN full_name;
$$
CREATE TABLE service_types (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    title_uz varchar(255) not null,
    title_ru varchar(255) not null,
    title_en varchar(255) not null
)