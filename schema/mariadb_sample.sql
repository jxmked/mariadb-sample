-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 25, 2022 at 07:29 AM
-- Server version: 10.10.2-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `mariadb_sample`
--

-- --------------------------------------------------------

--
-- Table structure for table `fav_cats`
--

CREATE TABLE `fav_cats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `color` varchar(64) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `fav_cats`
--

INSERT INTO `fav_cats` (`id`, `name`, `color`, `last_modified`) VALUES
(1, 'Louqui', 'Van', '2022-12-10 10:27:25'),
(2, 'Muning', 'Harlequin', '2022-12-10 10:27:25'),
(3, 'Tagpi', 'Tuxedo Tabi', '2022-12-10 10:27:25');

-- --------------------------------------------------------

--
-- Table structure for table `rate-limit`
--

CREATE TABLE `rate-limit` (
  `id` int(20) UNSIGNED NOT NULL,
  `remote-addr` varchar(20) DEFAULT NULL,
  `last-usage` int(20) NOT NULL,
  `time-start` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fav_cats`
--
ALTER TABLE `fav_cats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `rate-limit`
--
ALTER TABLE `rate-limit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `remote-addr` (`remote-addr`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fav_cats`
--
ALTER TABLE `fav_cats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rate-limit`
--
ALTER TABLE `rate-limit`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;
