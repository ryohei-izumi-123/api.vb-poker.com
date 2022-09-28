# DROP DATABASE vbpoker_v1;
# CREATE DATABASE vbpoker_v1 DEFAULT CHARSET = utf8mb4;
USE vbpoker_v1;


# GRANT ALL PRIVILEGES ON vbpoker_v1.* TO vbpokeradmin@localhost IDENTIFIED BY 'vbpoker_ZxYBhJd12' WITH GRANT OPTION; #-- FOR V5.x
# GRANT ALL PRIVILEGES ON vbpoker_v1.* TO vbpokeradmin@'%' IDENTIFIED BY 'vbpoker_ZxYBhJd12' WITH GRANT OPTION; #-- FOR V5.x
# GRANT ALL PRIVILEGES ON vbpoker_v1.* TO vbpokeradmin@'127.0.0.1' IDENTIFIED BY 'vbpoker_ZxYBhJd12' WITH GRANT OPTION; #-- FOR V5.x
# CREATE USER 'vbpokeradmin@localhost' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
GRANT ALL PRIVILEGES ON vbpoker_v1.* TO 'vbpokeradmin@localhost'; #-- FOR V8.x
# CREATE USER 'vbpokeradmin@%' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
GRANT ALL PRIVILEGES ON vbpoker_v1.* TO 'vbpokeradmin@%'; #-- FOR V8.x
# CREATE USER 'vbpokeradmin@127.0.0.1' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
GRANT ALL PRIVILEGES ON vbpoker_v1.* TO 'vbpokeradmin@127.0.0.1'; #-- FOR V8.x
FLUSH PRIVILEGES;


SET PASSWORD FOR 'vbpokeradmin'@'localhost'=PASSWORD('vbpoker_ZxYBhJd12'); #-- FOR V5.x
SET PASSWORD FOR 'vbpokeradmin'@'%'=PASSWORD('vbpoker_ZxYBhJd12'); #-- FOR V5.x
SET PASSWORD FOR 'vbpokeradmin'@'127.0.0.1'=PASSWORD('vbpoker_ZxYBhJd12'); #-- FOR V5.x
ALTER USER 'vbpokeradmin@localhost' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
ALTER USER 'vbpokeradmin@%' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
ALTER USER 'vbpokeradmin@127.0.0.1' IDENTIFIED WITH MYSQL_NATIVE_PASSWORD BY 'vbpoker_ZxYBhJd12'; #-- FOR V8.x
FLUSH PRIVILEGES;


SET  FOREIGN_KEY_CHECKS = 0;


# /** 国マスタ **/
DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '国ID',
  `name` VARCHAR(32) NOT NULL COMMENT '国名称',
  `iso3166_a2` VARCHAR(2) NOT NULL COMMENT 'ISO3166 ALPHA2',
  `iso3166_a3` VARCHAR(3) NOT NULL COMMENT 'ISO3166 ALPHA3',
  `call_prefix` VARCHAR(4) NOT NULL COMMENT 'INTL CALL PREFIX',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `countries_idx_1` (`name`),
  KEY `countries_idx_2` (`iso3166_a2`),
  KEY `countries_idx_3` (`iso3166_a3`),
  CONSTRAINT `countries_uk_1` UNIQUE KEY (`name`, `logical`),
  CONSTRAINT `countries_uk_2` UNIQUE KEY (`iso3166_a2`, `logical`),
  CONSTRAINT `countries_uk_3` UNIQUE KEY (`iso3166_a3`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='国マスタ';


# /** 仮想通貨銘柄マスタ **/
DROP TABLE IF EXISTS `currencies`;
CREATE TABLE `currencies` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '仮想通貨銘柄ID',
  `name` VARCHAR(32) NOT NULL COMMENT '仮想通貨銘柄名称',
  `symbol` VARCHAR(16) NOT NULL COMMENT '仮想通貨銘柄シンボル',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `currencies_idx_1` (`name`),
  CONSTRAINT `currencies_uk_1` UNIQUE KEY (`name`, `logical`),
  CONSTRAINT `currencies_uk_2` UNIQUE KEY (`symbol`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='仮想通貨銘柄マスタ';


# /** カテゴリーマスタ **/
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'カテゴリーID',
  `name` VARCHAR(64) NOT NULL COMMENT '名称',
  `img` VARCHAR(512) NOT NULL COMMENT '画像',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `categories_idx_1` (`name`),
  CONSTRAINT `categories_uk_1` UNIQUE KEY (`name`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='カテゴリーマスタ';


# /** 商品マスタ **/
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `category_id` INT(8) UNSIGNED NOT NULL COMMENT 'カテゴリーID',
  `name` VARCHAR(128) NOT NULL COMMENT '商品名',
  `price` DECIMAL(16, 4) NOT NULL COMMENT '金額',
  `remarks` LONGTEXT DEFAULT NULL COMMENT '備考',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `products_idx_1` (`name`),
  CONSTRAINT `products_uk_1` UNIQUE KEY (`name`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='商品マスタ';


# /** 顧客マスタ **/
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '顧客ID',
  `role` ENUM('head_office', 'master_agent', 'agent', 'na') NOT NULL DEFAULT 'na' COMMENT '顧客レベル',
  `username` VARCHAR(32) NOT NULL COMMENT 'ログインID',
  `password` VARCHAR(256) NOT NULL COMMENT 'パスワード',
  `first_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '名前(名)',
  `last_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '苗字(姓)',
  `full_name` VARCHAR(64) GENERATED ALWAYS AS (CONCAT(COALESCE(`first_name`, ''), ' ', COALESCE(`last_name`, ''))) VIRTUAL NOT NULL COMMENT 'フルネーム',
  `email` VARCHAR(128) NOT NULL DEFAULT '' COMMENT 'Eメールアドレス',
  `phone` VARCHAR(16) NOT NULL DEFAULT '' COMMENT '電話番号',
  `country_id` TINYINT(4) UNSIGNED NOT NULL COMMENT '国ID',
  `mfa_key` VARCHAR(64) DEFAULT NULL COMMENT '二段階認証キー',
  `ip_address` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IPアドレス',
  `user_agent` VARCHAR(256) NOT NULL DEFAULT '' COMMENT 'ユーザーエージェント',
  `finger_print` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'フィンガープリント',
  `last_login` DATETIME DEFAULT NULL COMMENT '最終ログイン',
  `failed_login_attempt` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ログイン失敗回数',
  `remarks` LONGTEXT DEFAULT NULL COMMENT '備考',
  `config` JSON NOT NULL COMMENT '設定',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `customers_idx_1` (`username`),
  CONSTRAINT `customers_uk_1` UNIQUE KEY (`username`, `logical`),
  CONSTRAINT `customers_uk_2` UNIQUE KEY (`email`, `logical`),
  CONSTRAINT `customers_uk_3` UNIQUE KEY (`phone`, `logical`),
  CONSTRAINT `customers_uk_4` UNIQUE KEY (`mfa_key`, `logical`),
  CONSTRAINT `customers_fk_1` FOREIGN KEY (`country_id`)
  	REFERENCES `countries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='顧客マスタ';
ALTER TABLE customers AUTO_INCREMENT=10000;


# /** 顧客セッション **/
DROP TABLE IF EXISTS `customer_sessions`;
CREATE TABLE `customer_sessions` (
  `id` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '顧客セッションID',
  `customer_id` INT(8) UNSIGNED NOT NULL COMMENT 'ユーザーID',
  `access_token` VARCHAR(512) NOT NULL COMMENT 'token',
  `refresh_token` VARCHAR(128) NOT NULL COMMENT 'refresh token',
  `expired_at` DATETIME DEFAULT NULL COMMENT '有効期限',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `customer_sessions_idx_1` (`customer_id`, `refresh_token`),
  CONSTRAINT `customer_sessions_uk_1` UNIQUE KEY (`customer_id`, `refresh_token`, `logical`),
  CONSTRAINT `customer_sessions_fk_1` FOREIGN KEY (`customer_id`)
  	REFERENCES `customers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='顧客セッション';


# /** 担当者アカウントマスタ **/
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '担当者アカウントID',
  `role` ENUM('administrator', 'manager', 'operator') NOT NULL DEFAULT 'operator' COMMENT '権限',
  `username` VARCHAR(32) NOT NULL COMMENT 'ログインID',
  `password` VARCHAR(256) NOT NULL COMMENT 'パスワード',
  `first_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '名前(名)',
  `last_name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '苗字(姓)',
  `full_name` VARCHAR(64) GENERATED ALWAYS AS (CONCAT(COALESCE(`first_name`, ''), ' ', COALESCE(`last_name`, ''))) VIRTUAL NOT NULL COMMENT 'フルネーム',
  `email` VARCHAR(128) NOT NULL DEFAULT '' COMMENT 'Eメールアドレス',
  `phone` VARCHAR(16) DEFAULT '' COMMENT '電話番号',
  `country_id` TINYINT(4) UNSIGNED NOT NULL COMMENT '国ID',
  `mfa_key` VARCHAR(64) DEFAULT NULL COMMENT '二段階認証キー',
  `ip_address` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IPアドレス',
  `user_agent` VARCHAR(256) NOT NULL DEFAULT '' COMMENT 'ユーザーエージェント',
  `finger_print` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'フィンガープリント',
  `last_login` DATETIME DEFAULT NULL COMMENT '最終ログイン',
  `failed_login_attempt` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ログイン失敗回数',
  `config` JSON NOT NULL COMMENT '設定',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `users_idx_1` (`username`),
  CONSTRAINT `users_uk_1` UNIQUE KEY (`username`, `logical`),
  CONSTRAINT `users_uk_2` UNIQUE KEY (`email`, `logical`),
  CONSTRAINT `users_uk_3` UNIQUE KEY (`phone`, `logical`),
  CONSTRAINT `users_uk_4` UNIQUE KEY (`mfa_key`, `logical`),
  CONSTRAINT `users_fk_1` FOREIGN KEY (`country_id`)
  	REFERENCES `countries` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='担当者アカウントマスタ';


# /** 担当者セッション **/
DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '担当者セッションID',
  `user_id` INT(8) UNSIGNED NOT NULL COMMENT 'ユーザーID',
  `access_token` VARCHAR(512) NOT NULL COMMENT 'token',
  `refresh_token` VARCHAR(128) NOT NULL COMMENT 'refresh token',
  `expired_at` DATETIME DEFAULT NULL COMMENT '有効期限',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `user_sessions_idx_1` (`user_id`, `refresh_token`),
  CONSTRAINT `user_sessions_uk_1` UNIQUE KEY (`user_id`, `refresh_token`, `logical`),
  CONSTRAINT `user_sessions_fk_1` FOREIGN KEY (`user_id`)
  	REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='担当者セッション';


# /** 注文マスタ **/
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '注文ID',
  `product_id` INT(8) UNSIGNED NOT NULL COMMENT '商品ID',
  `customer_id` INT(8) UNSIGNED NOT NULL COMMENT '顧客ID',
  `currency_id` TINYINT(4) UNSIGNED NOT NULL COMMENT '仮想通貨銘柄ID',
  `amount` TINYINT(4) NOT NULL DEFAULT 1 COMMENT '注文数',
  `tx_price` DECIMAL(16, 4) NOT NULL COMMENT '取引金額(銘柄単位)',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `orders_idx_1` (`product_id`),
  KEY `orders_idx_2` (`customer_id`),
  KEY `orders_idx_3` (`currency_id`),
  CONSTRAINT `orders_fk_1` FOREIGN KEY (`product_id`)
  	REFERENCES `products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `orders_fk_2` FOREIGN KEY (`customer_id`)
  	REFERENCES `customers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `orders_fk_3` FOREIGN KEY (`currency_id`)
  	REFERENCES `currencies` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='注文マスタ';


# /** 仮想通貨レート履歴 **/
DROP TABLE IF EXISTS `rates`;
CREATE TABLE `rates` (
  `id` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '仮想通貨レート履歴ID',
  `currency_id` TINYINT(4) UNSIGNED NOT NULL COMMENT '仮想通貨銘柄ID',
  `source` VARCHAR(128) NOT NULL COMMENT '情報源',
  `rate` DECIMAL(16, 4) NOT NULL COMMENT 'レート',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  CONSTRAINT `rates_fk_1` FOREIGN KEY (`currency_id`)
  	REFERENCES `currencies` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='仮想通貨レート履歴';


# /** 問い合わせマスタ(非会員向け) **/
DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE `inquiries` (
  `id` INT(16) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '問い合わせID',
  `inquiry_type` ENUM('default') NOT NULL DEFAULT 'default' COMMENT '問い合わせ区分',
  `full_name` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'フルネーム',
  `email` VARCHAR(128) NOT NULL DEFAULT '' COMMENT 'Eメールアドレス',
  `title` VARCHAR(256) NOT NULL DEFAULT '' COMMENT '問い合わせ内容',
  `detail` LONGTEXT NOT NULL COMMENT '詳細',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `inquiries_idx_1` (`inquiry_type`),
  KEY `inquiries_idx_2` (`full_name`),
  KEY `inquiries_idx_3` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='問い合わせマスタ';


# /** チケットマスタ(会員向け) **/
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` INT(16) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'チケットID',
  `user_id` INT(8) UNSIGNED NOT NULL COMMENT 'ユーザーID',
  `inquiry_type` ENUM('default', 'head_office_entry', 'master_agent_entry', 'agent_entry') NOT NULL DEFAULT 'default' COMMENT 'チケット区分',
  `title` VARCHAR(256) NOT NULL DEFAULT '' COMMENT '問い合わせ内容',
  `detail` LONGTEXT NOT NULL COMMENT '詳細',
  `img` BLOB NOT NULL COMMENT '画像',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `tickets_idx_1` (`user_id`),
  CONSTRAINT `tickets_fk_1` FOREIGN KEY (`user_id`)
  	REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='チケットマスタ';


# /** コメントマスタ **/
DROP TABLE IF EXISTS `ticket_comments`;
CREATE TABLE `ticket_comments` (
  `id` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'コメントID',
  `ticket_id` INT(16) UNSIGNED NOT NULL COMMENT 'ユーザーID',
  `commented_by` ENUM('customer', 'user') NOT NULL DEFAULT 'user' COMMENT '返信区分',
  `comment` LONGTEXT NOT NULL COMMENT 'コメント',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `img` BLOB NOT NULL COMMENT '画像',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `ticket_comments_idx_1` (`ticket_id`),
  KEY `ticket_comments_idx_2` (`commented_by`),
  CONSTRAINT `ticket_comments_fk_1` FOREIGN KEY (`ticket_id`)
  	REFERENCES `tickets` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='コメントマスタ';


# /** acls **/
DROP TABLE IF EXISTS `acls`;
CREATE TABLE `acls` (
  `id` INT(16) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'アクセス制御リストID',
  `role` ENUM('administrator', 'manager', 'operator', 'head_office', 'master_agent', 'agent', 'na') NOT NULL DEFAULT 'na' COMMENT '権限レベル',
  `permissions` JSON NOT NULL COMMENT 'CRUD MAPPING',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `acls_idx_1` (`role`),
  CONSTRAINT `acls_uk_1` UNIQUE KEY (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='アクセス制御リスト';


# /** システム設定マスタ **/
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'システム設定ID',
  `name` VARCHAR(32) NOT NULL DEFAULT 'DEFAULT' COMMENT 'システム設定名称',
  `fee` DECIMAL(8, 4) NOT NULL DEFAULT '0.0000' COMMENT '取引手数料',
  `currency_id` TINYINT(4) UNSIGNED NOT NULL COMMENT '仮想通貨銘柄ID',
  `address` VARCHAR(256) NOT NULL DEFAULT '' COMMENT '仮想通貨支払先アドレス',
  `config` JSON NOT NULL COMMENT '設定',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `settings_idx_1` (`name`),
  CONSTRAINT `settings_uk_1` UNIQUE KEY (`name`, `logical`),
  CONSTRAINT `settings_fk_1` FOREIGN KEY (`currency_id`)
  	REFERENCES `currencies` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='システム設定マスタ';


# /** ページマスタ **/
DROP TABLE IF EXISTS `webpages`;
CREATE TABLE `webpages` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ページマスタID',
  `page_type` ENUM('about', 'service', 'faq', 'free') NOT NULL DEFAULT 'free' COMMENT 'ページタイプ',
  `locale` ENUM('en', 'ja') NOT NULL DEFAULT 'en' COMMENT '言語',
  `content` LONGTEXT NOT NULL COMMENT 'コンテンツ',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `webpages_idx_1` (`page_type`, `locale`),
  CONSTRAINT `webpages_uk_1` UNIQUE KEY (`page_type`, `locale`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='ページマスタ';


# /** 言語マスタ **/
DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `id` TINYINT(4) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '言語ID',
  `scope` ENUM('public', 'private') NOT NULL DEFAULT 'public' COMMENT 'スコープ',
  `locale` ENUM('en', 'ja') NOT NULL DEFAULT 'en' COMMENT '言語',
  `i18n` JSON NOT NULL COMMENT 'JSON',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `languages_idx_1` (`scope`),
  KEY `languages_idx_2` (`locale`),
  CONSTRAINT `languages_uk_1` UNIQUE KEY (`scope`, `locale`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='言語マスタ';


#--/** SELECT vbpoker_v1.GET_AGE('2000-01-01 00:00:00');*/
DROP FUNCTION IF EXISTS `vbpoker_v1`.`GET_AGE`;
DELIMITER |
CREATE FUNCTION `vbpoker_v1`.`GET_AGE`(_DATE DATETIME)
RETURNS TINYINT(4) COMMENT '@USAGE: `SELECT vbpoker_v1.GET_AGE("1985-07-02 00:00:00");`' NOT DETERMINISTIC NO SQL
BEGIN
    DECLARE _AGE TINYINT(4);
    DECLARE _YEARS INT(12);
    DECLARE _MONTHS INT(12);
    DECLARE _DAYS INT(12);
    DECLARE _DIFF FLOAT;
    SET _DIFF = DATEDIFF(CURRENT_DATE(),_DATE) / 365.25;
    SET _YEARS = FLOOR(_DIFF);
    SET _MONTHS = FLOOR((_DIFF - _YEARS) * 365.25 / 30.4375) MOD 12;
    SET _DIFF = ((_DIFF - _YEARS) * 365.25 / 30.4375);
    SET _DAYS = CEIL(((_DIFF - _MONTHS) * 30.4375)) MOD 31;
    SET _AGE = _YEARS;
    RETURN _AGE;
    END;
|
DELIMITER ;


DROP TRIGGER IF EXISTS `before_update_customers`;
DELIMITER |
CREATE TRIGGER `before_update_customers`
#--/** @COMMENT: TO UPDATE STATUS WHEN `failed_login_attempt` MORE THAN 3 TIMES */
BEFORE UPDATE
     ON `customers` FOR EACH ROW
     _TRIGGER: BEGIN
         IF NEW.`failed_login_attempt` > 3 THEN
           SET NEW.`status` = 'inactive';
           SET NEW.`failed_login_attempt` = 0;
         END IF;
     END;
|
DELIMITER ;


DROP TRIGGER IF EXISTS `before_update_users`;
DELIMITER |
CREATE TRIGGER `before_update_users`
#--/** @COMMENT: TO UPDATE STATUS WHEN `failed_login_attempt` MORE THAN 3 TIMES */
BEFORE UPDATE
     ON `users` FOR EACH ROW
     _TRIGGER: BEGIN
         IF NEW.`failed_login_attempt` > 3 THEN
           SET NEW.`status` = 'inactive';
           SET NEW.`failed_login_attempt` = 0;
         END IF;
     END;
|
DELIMITER ;


# /** ↑↑↑ここまでOK↑↑↑ **/


# /** 取引履歴 **/
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` BIGINT(32) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '取引履歴ID',
  `from_id` INT(8) UNSIGNED NOT NULL COMMENT '送金元組織ID',
  `from_balance` DECIMAL(16, 4) NOT NULL DEFAULT '0.0000' COMMENT '送金元組織終了残高',
  `to_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '送金先組織ID',
  `to_balance` DECIMAL(16, 4) DEFAULT NULL COMMENT '送金先組織終了残高',
  `player_id` INT(8) UNSIGNED DEFAULT NULL COMMENT 'プレイヤーID',
  `player_balance` DECIMAL(16, 4) DEFAULT NULL COMMENT 'プレイヤー終了残高',
  `amount` DECIMAL(16, 4) NOT NULL DEFAULT '0.0000' COMMENT '金額',
  `uuid` VARCHAR(64) NOT NULL COMMENT 'UUID',
  `direction` ENUM('increase', 'decrease') NOT NULL DEFAULT 'increase' COMMENT 'IN/OUT区分',
  `kind` ENUM('cash', 'bet', 'payout', 'refund') NOT NULL DEFAULT 'cash' COMMENT '取引区分',
  `ref_no` VARCHAR(128) DEFAULT NULL COMMENT '参照番号',
  `remarks` TEXT DEFAULT NULL COMMENT '備考',
  `details` JSON NOT NULL COMMENT '詳細',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `transactions_idx_1` (`from_id`, `to_id`, `status`),
  KEY `transactions_idx_2` (`from_id`, `player_id`, `status`),
  KEY `transactions_idx_3` (`direction`),
  KEY `transactions_idx_4` (`kind`),
  KEY `transactions_idx_5` (`uuid`),
  CONSTRAINT `transactions_uk_1` UNIQUE KEY (`uuid`, `logical`),
  CONSTRAINT `transactions_fk_1` FOREIGN KEY (`from_id`)
  	REFERENCES `organizations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `transactions_fk_2` FOREIGN KEY (`to_id`)
  	REFERENCES `organizations` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL,
  CONSTRAINT `transactions_fk_3` FOREIGN KEY (`player_id`)
  	REFERENCES `players` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='取引履歴';


SET  FOREIGN_KEY_CHECKS = 1;

# /** プレイヤーアカウントマスタ **/
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players` (
  `id` INT(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'プレイヤーアカウントID',
  `external_id` VARCHAR(128) NOT NULL COMMENT '外部ID',
  `rank` ENUM('silver', 'gold', 'platinum', 'diamond', 'black') NOT NULL DEFAULT 'silver' COMMENT 'ランク',
  `balance` DECIMAL(16, 4) NOT NULL COMMENT '残高',
  `name` VARCHAR(32) NOT NULL COMMENT '名前',
  `photo` VARCHAR(256) NOT NULL DEFAULT '' COMMENT '写真',
  `ip_address` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IPアドレス',
  `user_agent` VARCHAR(256) NOT NULL DEFAULT '' COMMENT 'ユーザーエージェント',
  `finger_print` VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'フィンガープリント',
  `last_login` DATETIME DEFAULT NULL COMMENT '最終ログイン',
  `failed_login_attempt` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ログイン失敗回数',
  `config` JSON NOT NULL COMMENT '設定',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `players_idx_1` (`name`),
  CONSTRAINT `players_uk_1` UNIQUE KEY (`external_id`, `logical`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='プレイヤーアカウントマスタ';

# /** プレイヤーセッション **/
DROP TABLE IF EXISTS `player_sessions`;
CREATE TABLE `player_sessions` (
  `id` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'プレイヤーセッションID',
  `user_id` INT(8) UNSIGNED NOT NULL COMMENT 'プレイヤーID',
  `access_token` VARCHAR(512) NOT NULL COMMENT 'token',
  `refresh_token` VARCHAR(128) NOT NULL COMMENT 'refresh token',
  `expired_at` DATETIME DEFAULT NULL COMMENT '有効期限',
  `status` ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'pending' COMMENT '状態',
  `created_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '作成者',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '更新者',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  `deleted_id` INT(8) UNSIGNED DEFAULT NULL COMMENT '削除者',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '削除日時',
  `logical` TINYINT(1) GENERATED ALWAYS AS (CASE WHEN `deleted_at` IS NULL THEN 1 ELSE NULL END) STORED COMMENT '論理値',
  PRIMARY KEY (`id`),
  KEY `player_sessions_idx_1` (`user_id`, `refresh_token`),
  CONSTRAINT `player_sessions_uk_1` UNIQUE KEY (`user_id`, `refresh_token`, `logical`),
  CONSTRAINT `player_sessions_fk_1` FOREIGN KEY (`user_id`)
  	REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT
COMMENT='プレイヤーセッション';