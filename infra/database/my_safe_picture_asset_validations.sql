-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: mysafedraw-mysql.czki6aooq85e.ap-northeast-2.rds.amazonaws.com    Database: my_safe_picture
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `asset_validations`
--

DROP TABLE IF EXISTS `asset_validations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_validations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(255) NOT NULL,
  `is_correct` bit(1) NOT NULL,
  `stage` int NOT NULL,
  `scenario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtdmd3n9gg2jrjk3y3fgjqnenv` (`scenario_id`),
  CONSTRAINT `FKtdmd3n9gg2jrjk3y3fgjqnenv` FOREIGN KEY (`scenario_id`) REFERENCES `scenarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_validations`
--

LOCK TABLES `asset_validations` WRITE;
/*!40000 ALTER TABLE `asset_validations` DISABLE KEYS */;
INSERT INTO `asset_validations` VALUES (1,'소화기',_binary '',1,1),(2,'물',_binary '',1,1),(3,'물양동이',_binary '',1,1),(4,'선풍기',_binary '\0',1,1),(5,'핸드폰',_binary '',2,1),(6,'전화기',_binary '',2,1),(7,'마스크',_binary '',3,1),(8,'손수건',_binary '',3,1),(9,'계단',_binary '',4,1),(10,'엘리베이터',_binary '\0',4,1),(11,'구급차',_binary '',5,1),(12,'병원',_binary '',5,1);
/*!40000 ALTER TABLE `asset_validations` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-21 17:26:43
