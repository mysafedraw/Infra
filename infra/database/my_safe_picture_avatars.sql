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
-- Table structure for table `avatars`
--

DROP TABLE IF EXISTS `avatars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avatars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feature` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `asset` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avatars`
--

LOCK TABLES `avatars` WRITE;
/*!40000 ALTER TABLE `avatars` DISABLE KEYS */;
INSERT INTO `avatars` VALUES (1,'마루는 활기차고 충성스러우며 항상 주위 사람들을 챙기는 마음씨 좋은 성격이에요. 호기심이 넘쳐, 모험을 즐기고 새로운 것에 도전하는 것을 좋아합니다.','마루','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/dog.png',''),(2,'호돌이는 듬직하고 정의감이 넘치며, 동료를 잘 이끄는 리더 같은 성격이에요. 때론 무섭게 보일 수 있지만, 속은 따뜻하고 배려심이 깊습니다.','호돌이','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/tiger.png',NULL),(3,'미피는 활달하고 긍정적이며, 작은 일에도 금방 기뻐하는 낙천적인 성격이에요. 빠르게 움직이며 상황에 따라 빠른 결정을 내리는 데 능숙해요.','미피','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/bunny.png',NULL),(4,'폭스는 영리하고 재빠르며, 상황 파악이 빠르고 현명해요. 장난기가 많아, 가끔씩 짓궂은 농담을 즐기기도 합니다.','폭스','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/fox.png',NULL),(5,'펭펭이는 느긋하고 여유로운 성격으로, 남의 말을 잘 들어주는 편이에요. 귀엽고 엉뚱한 매력이 있어, 주위 사람들에게 인기가 많습니다.','펭펭이','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/penguin.png',NULL),(6,'월드콘은 우아하고 신비로우며, 조금 도도한 성격을 가지고 있어요. 반짝이는 것을 좋아하며, 자신만의 스타일을 고집합니다.','월드콘','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/unicorn.png',NULL),(7,'움고는 무심한 듯 시크하지만, 다가가면 은근히 따뜻한 성격을 가지고 있어요. 가끔씩 혼자만의 시간을 즐기지만, 친한 이들에게는 마음을 열기도 해요.','움고','https://my-draw-safety-draw.s3.ap-northeast-2.amazonaws.com/character/cat.png',NULL);
/*!40000 ALTER TABLE `avatars` ENABLE KEYS */;
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
