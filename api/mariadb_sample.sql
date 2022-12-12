-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 10, 2022 at 12:40 PM
-- Server version: 10.9.4-MariaDB
-- PHP Version: 8.1.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `mariadb_sample`
--
CREATE DATABASE IF NOT EXISTS `mariadb_sample` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `mariadb_sample`;

-- --------------------------------------------------------

--
-- Table structure for table `fav_cats`
--

CREATE TABLE `fav_cats_pair` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `color` varchar(64) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `fav_cats`
--

INSERT INTO `fav_cats_pair` (`id`, `name`, `color`, `last_modified`) VALUES
(1, 'Louqui', 'Van', '2022-12-10 10:27:25'),
(2, 'Muning', 'Harlequin', '2022-12-10 10:27:25'),
(3, 'Tagpi', 'Tuxedo Tabi', '2022-12-10 10:27:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fav_cats`
--
ALTER TABLE `fav_cats_pair`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fav_cats`
--
ALTER TABLE `fav_cats_pair`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;







SELECT * FROM fav_cats WHERE NOT EXISTS (SELECT * FROM fav_cats_pair WHERE fav_cats.last_modified = fav_cats_pair.last_modified);


   
(SELECT last_modified, id FROM fav_cats
    EXCEPT
    SELECT last_modified, id FROM fav_cats_pair)  
UNION ALL
(   SELECT * FROM fav_cats_pair
    EXCEPT
    SELECT * FROM fav_cats) 
    
    
    
    
    
INSERT INTO fav_cats_pair (name, color,last_modified) 
    SELECT name, color, last_modified FROM fav_cats;
    
    
    
    
    
    
    
UPDATE fav_cats_pair
SET name = fav_cats.name, color = fav_cats.color, last_modified = fav_cats.last_modified
FROM fav_cats_pair
INNER JOIN fav_cats
ON fav_cats_pair.id = fav_cats.id
