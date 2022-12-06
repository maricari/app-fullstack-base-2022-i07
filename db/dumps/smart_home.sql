-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 26, 2019 at 02:50 PM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.4

CREATE DATABASE IF NOT EXISTS smart_home;

USE smart_home;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_home`
--

-- --------------------------------------------------------

--
-- Table structure for table `Devices`
--

CREATE TABLE `Devices` (
  `id` int not null,
  `type` tinyint not null,                         -- luces, ventilación, etc.
  `name` varchar(64) not null,                     -- nombre del dispositivo
  `description` varchar(128) not null,             -- descripción
  `state_type` tinyint not null,                   -- 1: on/off, 2: intensidad
  `state` boolean not null default false,          -- false: off, true: on
  `intensidad` decimal(4,2) not null default 0.00  -- 0 a 1 (solo para state_type=2)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Dumping data for table `Devices`
--

INSERT INTO `Devices` (`id`, `type`, `name`, `description`, `state_type`, `state`, `intensidad`) VALUES
(1,1, 'Luces interior', 'Luz living y comedor', 1, false, 0),
(2,1, 'Luces exterior', 'Luces jardín', 2, false, 1),
(3,1, 'Luz entrada', 'Luz entrada principal', 1, false, 1),
(4,2, 'AA', 'Aire acondicionado central', 1, false, 1),
(5,3, 'Persiana 1', 'Persiana living', 1, false, 1),
(6,3, 'Persiana 2', 'Persiana habitación', 1, false, 1);


--
-- Indexes for dumped tables
--

--
-- Indexes for table `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
