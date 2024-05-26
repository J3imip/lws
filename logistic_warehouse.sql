-- drop table manufacturer, customer, supplier, supplier_manufacturer, product, warehouse, warehouse_product, "order", order_product;

-- drop type user_status;
-- drop type order_status;
-- drop type payment_method;
--
-- drop function no_refund_amount_lost_quantity_on_insert;
-- drop function calculate_order_period;
-- drop function calculate_refund_amount;

create type user_status as enum ('kyc_pending', 'kyc_approved', 'kyc_rejected', 'banned');

create table customer
(
    id            bigserial primary key,
    company_name  varchar(255),
    first_name    varchar(255)                                   not null, -- Representative
    last_name     varchar(255)                                   not null, -- Representative
    email         varchar(320),                                            -- RFC 5322
    phone         varchar(16)                                    not null, -- E.164 format, e.g. +380000000000
    country       varchar(2)                                     not null, -- ISO 3166-1 alpha-2
    city          varchar(255)                                   not null, -- Headquarters
    address       text                                           not null, -- Headquarters
    postal        varchar(16)                                    not null, -- ZIP code
    password_hash varchar(72)                                    not null, -- bcrypt
    photo         varchar(255),                                            -- AWS S3 Path
    status        user_status              default 'kyc_pending' not null,
    created_at    timestamp with time zone default now()         not null,
    updated_at    timestamp with time zone default now()         not null
);

create table manufacturer
(
    id         bigserial primary key,
    name       varchar(255)                           not null, -- Company Name
    first_name varchar(255)                           not null, -- Representative
    last_name  varchar(255)                           not null, -- Representative
    country    varchar(2),                                      -- ISO 3166-1 alpha-2
    city       varchar(255),                                    -- Headquarters
    address    text,                                            -- Headquarters
    logo       varchar(255),                                    -- AWS S3 Path
    phone      varchar(16),                                     -- E.164 format, e.g. +380000000000
    email      varchar(320),                                    -- RFC 5322
    category   varchar(255),                                    -- e.g. Food, Electronics, etc. Arbitrary string
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create type order_status as enum ('pending', 'processing', 'paid', 'shipped', 'delivered', 'rejected', 'refunded');
create type payment_method as enum ('cards', 'crypto', 'cash');

create table "order"
(
    id                     bigserial primary key,
    customer_id            bigint references customer,
    status                 order_status             default 'pending' not null,
    payment                payment_method                             not null,
    price                  bigint
        constraint positive_price check (price > 0),                            -- Last 6 digits are cents
    currency               varchar(6),                                          -- ISO 4217 or token symbol, if payment is crypto
    delivery_period        interval,
    actual_delivery_period interval
        constraint positive_actual_delivery_period check (actual_delivery_period > interval '0 days'),
    receipt_date           timestamp with time zone                   not null
        constraint receipt_date_in_future check (receipt_date > now()),
    lost_quantity          bigint
        constraint positive_lost_quantity check (lost_quantity >= 0),
    refund_amount          bigint
        constraint positive_refunded_amount check (refund_amount >= 0),
    country                varchar(2)                                 not null, -- ISO 3166-1 alpha-2
    city                   varchar(255)                               not null,
    address                text                                       not null,
    created_at             timestamp with time zone default now()     not null,
    updated_at             timestamp with time zone default now()     not null
);

create or replace function no_refund_amount_lost_quantity_on_insert() returns trigger as
$$
begin
    if new.lost_quantity > 0 then raise exception 'Lost quantity is not allowed on insert'; end if;
    if new.refund_amount > 0 then raise exception 'Refund amount is not allowed on insert'; end if;
    return new;
end;
$$ language plpgsql;

create trigger no_refund_amount_lost_quantity_on_insert
    before insert
    on "order"
    for each row
execute procedure no_refund_amount_lost_quantity_on_insert();

create or replace function calculate_order_period() returns trigger as
$$
begin
    new.delivery_period := new.receipt_date - new.created_at;
    return new;
end;
$$ language plpgsql;

create trigger calculate_order_period_trigger
    before insert or update
    on "order"
    for each row
execute procedure calculate_order_period();

create or replace function calculate_refund_amount() returns trigger as
$$
begin
    if new.lost_quantity > 0 then
        -- Retrieve the product price using a subquery with proper joins
        select p.price * (new.lost_quantity + 0.05)
        into new.refund_amount
        from "order" o
                 join order_product op on op.order_id = o.id
                 join product p on p.id = op.product_id
        where o.id = new.id;
    end if;

    return new;
end;
$$ language plpgsql;

create trigger calculate_refund_amount_trigger
    before update
    on "order"
    for each row
execute procedure calculate_refund_amount();

create table supplier
(
    id         bigserial primary key,
    name       varchar(255)                           not null, -- Company Name
    first_name varchar(255)                           not null, -- Representative
    last_name  varchar(255)                           not null, -- Representative
    country    varchar(2),                                      -- ISO 3166-1 alpha-2
    city       varchar(255),                                    -- Headquarters
    address    text,                                            -- Headquarters
    logo       varchar(255),                                    -- AWS S3 Path
    phone      varchar(16),                                     -- E.164 format, e.g. +380000000000
    email      varchar(320),                                    -- RFC 5322
    category   varchar(255),                                    -- e.g. Food, Electronics, etc. Arbitrary string
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create table supplier_manufacturer
(
    supplier_id     bigint references supplier,
    manufacturer_id bigint references manufacturer,
    primary key (supplier_id, manufacturer_id)
);

create table product
(
    id              bigserial primary key,
    name            varchar(255)                           not null,
    description     varchar(2048),
    category        varchar(255),                    -- e.g. Food, Electronics, etc. Arbitrary string
    volume          numeric                          -- In m^3
        constraint positive_volume check (volume > 0),
    price           bigint
        constraint positive_price check (price > 0), -- Last 6 digits are cents. If crypto, then USD equivalent
    currency        varchar(3),                      -- ISO 4217
    manufacturer_id bigint references manufacturer,
    created_at      timestamp with time zone default now() not null,
    updated_at      timestamp with time zone default now() not null
);

create table warehouse
(
    id         bigserial primary key,
    capacity   numeric,                                         -- In m^3
    country    varchar(2),                                      -- ISO 3166-1 alpha-2
    city       varchar(255),
    address    text,
    first_name varchar(255)                           not null, -- Representative
    last_name  varchar(255)                           not null, -- Representative
    phone      varchar(16)                            not null, -- E.164 format, e.g. +380000000000
    email      varchar(320),                                    -- RFC 5322
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create table warehouse_product
(
    warehouse_id     bigint references warehouse,
    product_id       bigint references product,
    product_quantity bigint,
    primary key (warehouse_id, product_id)
);

create table order_product
(
    order_id         bigint references "order",
    product_id       bigint references product,
    product_quantity bigint,
    primary key (order_id, product_id)
);
