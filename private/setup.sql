CREATE DATABASE IF NOT EXISTS tcc;
use tcc;
CREATE TABLE IF NOT EXISTS `resource_managers` (
 `_id` INT NOT NULL AUTO_INCREMENT,
 `first_name` varchar(100) DEFAULT NULL,
 `last_name` varchar(100) DEFAULT NULL,
 `cpf` varchar(20) DEFAULT NULL,
 `username` varchar(20) DEFAULT NULL,
 `password` varchar(20) DEFAULT NULL,
 `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

 CREATE TABLE IF NOT EXISTS `resources` (
  `_id` INT NOT NULL AUTO_INCREMENT,
  `resource_manager_id` INT NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `action_id` varchar(20) DEFAULT NULL,
  `target` varchar(1000) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

  CREATE TABLE IF NOT EXISTS `users` (
   `_id` INT NOT NULL AUTO_INCREMENT,
   `first_name` varchar(100) DEFAULT NULL,
   `last_name` varchar(100) DEFAULT NULL,
   `cpf` varchar(20) DEFAULT NULL,
   `rfid_token` varchar(100) DEFAULT NULL,
   `biometric_bin` MEDIUMBLOB DEFAULT NULL,
   `facial_bin` MEDIUMBLOB DEFAULT NULL,
   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
