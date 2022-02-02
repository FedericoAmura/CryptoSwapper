START TRANSACTION;

CREATE SCHEMA swapper;

CREATE TABLE swapper.swap
(
    id             SERIAL PRIMARY KEY,
    pair           VARCHAR(8)                                         NOT NULL,
    side           VARCHAR(8)                                         NOT NULL,
    volume         VARCHAR(255)                                       NOT NULL,
    provider_price VARCHAR(255)                                       NOT NULL,
    price          VARCHAR(255)                                       NOT NULL,
    order_id        VARCHAR(255),
    start          TIMESTAMP WITH TIME ZONE                           NOT NULL,
    execution      TIMESTAMP WITH TIME ZONE,
    expiration     TIMESTAMP WITH TIME ZONE                           NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMIT;
