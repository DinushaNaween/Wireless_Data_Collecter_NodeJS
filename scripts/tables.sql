-- -----------------------------------------------------
-- Schema freedb_wdc (Wireless Data Collector)
-- -----------------------------------------------------
CREATE SCHEMA `freedb_wdc` IF NOT EXISTS DEFAULT CHARACTER SET utf8;
USE `freedb_wdc`;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`role` (
  `roleId` INT NOT NULL AUTO_INCREMENT ,
  `roleName` VARCHAR(45) NOT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`roleId`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;
  
-- -----------------------------------------------------
-- Table `freedb_wdc`.`privilege`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`privilege` (
  `privilegeId` INT NOT NULL AUTO_INCREMENT ,
  `privilegeDescription` VARCHAR(45) NOT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`privilegeId`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`rolePrivilege`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`rolePrivilege` (
  `rolePrivilegeId` INT NOT NULL AUTO_INCREMENT ,
  `roleId` INT NULL ,
  `privilegeId` INT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`rolePrivilegeId`) ,
  FOREIGN KEY (`roleId`)
  REFERENCES `freedb_wdc`.`role` (`roleId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE,
  FOREIGN KEY (`privilegeId`)
  REFERENCES `freedb_wdc`.`privilege` (`privilegeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT ,
  `email` VARCHAR(45) NOT NULL ,
  `userName` VARCHAR(45) NOT NULL ,
  `firstName` VARCHAR(45) NOT NULL ,
  `lastName` VARCHAR(45) NOT NULL ,
  `loginPassword` LONGTEXT NOT NULL ,
  `roleId` INT NOT NULL ,
  `userImageURL` LONGTEXT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`userId`),
  FOREIGN KEY (`roleId`)
  REFERENCES `freedb_wdc`.`role` (`roleId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`authToken`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`authToken` (
  `tokenId` INT NOT NULL AUTO_INCREMENT ,
  `userId` INT NOT NULL,
  `refreshToken` LONGTEXT NOT NULL,
  `revoked` INT(1) ZEROFILL NULL ,
  `createdDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`tokenId`),
  FOREIGN KEY (`userId`)
  REFERENCES `freedb_wdc`.`user` (`userId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`collection`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`collection` (
  `collectionId` INT NOT NULL AUTO_INCREMENT ,
  `collectionName` VARCHAR(45) NOT NULL ,
  `collectionLocation` VARCHAR(45) NOT NULL ,
  `units` LONGTEXT NULL ,
  `createdUserId` INT NOT NULL ,
  `collectionImageURL` LONGTEXT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`collectionId`) ,
  FOREIGN KEY (`createdUserId`)
  REFERENCES `freedb_wdc`.`user` (`userId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`unit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`unit` (
  `unitId` INT NOT NULL AUTO_INCREMENT ,
  `unitName` VARCHAR(45) NULL ,
  `unitLocation` VARCHAR(45) NOT NULL ,
  `parentNodes` LONGTEXT NULL ,
  `collectionId` INT NOT NULL ,
  `createdUserId` INT NOT NULL ,
  `unitImageURL` LONGTEXT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`unitId`) ,
  FOREIGN KEY (`collectionId`)
  REFERENCES `freedb_wdc`.`collection` (`collectionId`)
  ON DELETE NO ACTION
	ON UPDATE CASCADE,
  FOREIGN KEY (`createdUserId`)
  REFERENCES `freedb_wdc`.`user` (`userId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`parentNode`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`parentNode` (
  `parentNodeId` INT NOT NULL AUTO_INCREMENT ,
  `parentNodeName` VARCHAR(45) NULL ,
  `parentNodeLocation` VARCHAR(45) NOT NULL ,
  `nodes` LONGTEXT NULL ,
  `unitId` INT NOT NULL ,
  `collectionId` INT NOT NULL ,
  `createdUserId` INT NOT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`parentNodeId`) ,
  FOREIGN KEY (`unitId`)
  REFERENCES `freedb_wdc`.`unit` (`unitId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE,
  FOREIGN KEY (`collectionId`)
  REFERENCES `freedb_wdc`.`collection` (`collectionId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`node`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`node` (
  `nodeId` INT NOT NULL AUTO_INCREMENT ,
  `parentNodeId` INT NOT NULL ,
  `createdUserId` INT NOT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`nodeId`),
  FOREIGN KEY (`parentNodeId`)
  REFERENCES `freedb_wdc`.`parentNode` (`parentNodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`data`
-- This is example for a data table.
-- Every node having its own data table like this one.
-- These data tables are generated by the system as user requested parameters.
-- All other fields except data1, data2, data3, data4 are common for every data table.
-- data1, data2, data3, data4 are sensor fields and they can be different from one table to another.
-- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `freedb_wdc`.`data` (
--   `dataId` INT NOT NULL AUTO_INCREMENT ,
--   `nodeId` INT NOT NULL ,
--   `data1` VARCHAR(45) NULL ,
--   `data2` VARCHAR(45) NULL ,
--   `data3` VARCHAR(45) NULL ,
--   `data4` VARCHAR(45) NULL ,
--   `isValidated` INT(1) ZEROFILL NULL ,
--   `disabled` INT(1) ZEROFILL NULL ,
--   `savedDateTime` DATETIME NULL DEFAULT NULL,
--   PRIMARY KEY (`dataId`) ,
--   FOREIGN KEY (`nodeId`)
--   REFERENCES `freedb_wdc`.`node` (`nodeId`)
-- 	ON DELETE NO ACTION
-- 	ON UPDATE CASCADE)
--   ENGINE = InnoDB
--   DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`sensor` (
  `sensorId` INT NOT NULL AUTO_INCREMENT ,
  `sensorName` VARCHAR(45) NULL ,
  `sensorDiscription` VARCHAR(45) NULL ,
  `dataType` VARCHAR(45) NULL ,
  `dataSize` VARCHAR(45) NULL ,
  `sensingRange` VARCHAR(45) NULL ,
  `technology` VARCHAR(45) NULL ,
  `workingVoltage` VARCHAR(45) NULL ,
  `dimensions` VARCHAR(45) NULL ,
  `specialFact` VARCHAR(80) NULL ,
  `sensorImageURL` LONGTEXT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`sensorId`))
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`nodeSensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`nodeSensor` (
  `nodeSensorId` INT NOT NULL AUTO_INCREMENT ,
  `nodeId` INT NOT NULL ,
  `sensorId` INT NOT NULL ,
  `disabled` INT(1) ZEROFILL NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`nodeSensorId`),
  FOREIGN KEY (`nodeId`)
  REFERENCES `freedb_wdc`.`node` (`nodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE,
  FOREIGN KEY (`sensorId`)
  REFERENCES `freedb_wdc`.`sensor` (`sensorId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`dataAck`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`dataAck` (
  `dataAckId` INT NOT NULL AUTO_INCREMENT ,
  `parentNodeId` INT NOT NULL ,
  `successNodes` LONGTEXT NULL ,
  `errorNodes` LONGTEXT NULL ,
  `missedNodes` LONGTEXT NULL ,
  `savedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`dataAckId`),
  FOREIGN KEY (`parentNodeId`)
  REFERENCES `freedb_wdc`.`parentNode` (`parentNodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`dataValidation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`dataValidation` (
  `dataValidationId` INT NOT NULL AUTO_INCREMENT ,
  `parentNodeId` INT NOT NULL ,
  `sensorId` INT NOT NULL ,
  `sensorName` VARCHAR(45) NOT NULL,
  `lowerValidLimit` INT(10) NULL ,
  `upperValidLimit` INT(10) NULL ,
  `lastModifiedUser` VARCHAR(30) NULL DEFAULT NULL ,
  `lastModifiedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`dataValidationId`),
  FOREIGN KEY (`parentNodeId`)
  REFERENCES `freedb_wdc`.`parentNode` (`parentNodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `freedb_wdc`.`validationAck`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freedb_wdc`.`validationAck` (
  `validationAckId` INT NOT NULL AUTO_INCREMENT ,
  `parentNodeId` INT NOT NULL ,
  `nodeId` INT NOT NULL ,
  `dataValidationId` INT NOT NULL ,
  `sensorName` VARCHAR(45) NOT NULL,
  `receivedValue` INT(10) NULL ,
  `lowerValidLimit` INT(10) NULL ,
  `upperValidLimit` INT(10) NULL ,
  `status` VARCHAR(20) NULL ,
  `savedDateTime` DATETIME NULL DEFAULT NULL ,
  PRIMARY KEY (`validationAckId`),
  FOREIGN KEY (`parentNodeId`)
  REFERENCES `freedb_wdc`.`parentNode` (`parentNodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE, 
  FOREIGN KEY (`nodeId`)
  REFERENCES `freedb_wdc`.`node` (`nodeId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE,
  FOREIGN KEY (`dataValidationId`)
  REFERENCES `freedb_wdc`.`dataValidation` (`dataValidationId`)
	ON DELETE NO ACTION
	ON UPDATE CASCADE)
  ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8;