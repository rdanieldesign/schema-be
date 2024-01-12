CREATE TABLE `schemaDefinitions`
    (
      `id`      VARCHAR(36) NOT NULL UNIQUE,
      `name`    VARCHAR(500),    
      PRIMARY KEY (`id`)
    )
    engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `entities`
    (
        `id`                  VARCHAR(36) NOT NULL UNIQUE,
        `schemaId`            VARCHAR(36) NOT NULL,
        `createdDate`         DATETIME NOT NULL,
        `updatedDate`         DATETIME NOT NULL,
        `values`              JSON,
        PRIMARY KEY (`id`),
        INDEX schemaIndex (schemaId),
        FOREIGN KEY (schemaId) REFERENCES schemaDefinitions(`id`)
    )
    engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `attributes`
    (
      `id`              VARCHAR(36) NOT NULL UNIQUE,
      `name`            VARCHAR(500),
      `valueType`       ENUM('text', 'text-long', 'date', 'date-time', 'single-select', 'multi-select', 'html', 'number'),
      `validationType`  ENUM('positive', 'email', 'phone-number'),
      `required`        BOOLEAN,      
      `optionEntityId`  VARCHAR(36) NULL,
      PRIMARY KEY (`id`),
      FOREIGN KEY (optionEntityId) REFERENCES entities(`id`)
    )
    engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `schemaAttributes`
    (
      `attributeId`     VARCHAR(36) NOT NULL,
      `schemaId`        VARCHAR(36) NOT NULL,
      `primary`         BOOLEAN,
      `secondary`       BOOLEAN,
      FOREIGN KEY (attributeId) REFERENCES attributes(`id`),
      FOREIGN KEY (schemaId) REFERENCES schemaDefinitions(`id`)
    )
    engine = innodb charset=utf8mb4 COLLATE utf8mb4_general_ci;


-- NOTES
--     - Attributes - could belong to multiple schemas, and be shared (for reporting purposes)
--         - requires a "schemaAttributes" table
--          - removing "fieldKey" since everything is custom, no sytem reference, use "id" instead
--      - GUIDs
--          - resource: https://mahcloud.medium.com/uuid-in-mysql-5-7-903ba7775a5d
    