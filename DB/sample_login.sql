-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 15, 2020 at 10:22 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sample_login`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `username` varchar(255) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `gender` varchar(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(10) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_on` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_on` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`username`, `first_name`, `last_name`, `profile_pic`, `gender`, `dob`, `email`, `mobile`, `address`, `status`, `created_on`, `modified_on`) VALUES
('Eswar', 'Eswar', 'V', '271534200813_test.JPG', 'Male', '1992-03-16', 'eswar.45@gmail.com', '9989826156', 'West Bengal', 0, '2020-08-15 13:27:34', '2020-08-15 13:30:11'),
('poorna', 'poorna', 'polamarasetty', NULL, 'Male', '2019-01-11', 'poornachand046@gmail.com', '7396253587', 'pendurthi', 1, '2020-08-15 12:57:00', '2020-08-15 12:57:00'),
('rahul123@gmail.com', 'Rahul', 'K', '0814002023_teddy.jpg', 'Male', '1993-03-15', 'rahul123@gmail.com', '8887364534', 'Pune', 1, '2020-08-13 04:47:47', '2020-08-14 23:54:02'),
('rajini.st@yahoo.com', 'Rajini', 'ST', '571427200823_sign.png', 'Female', '1997-02-16', 'rajini.st@yahoo.com', '9898787625', 'Chennai', 1, '2020-08-14 23:57:27', '2020-08-14 23:57:27'),
('rupa123@gmail.com', 'Rupa', 'Lanka', NULL, 'Male', '1995-06-15', 'rupa123@gmail.com', '8992372912', 'Hyderabad', 1, '2020-08-14 21:32:25', '2020-08-14 21:32:25'),
('suresh123@gmail.com', 'Suresh', 'YS', NULL, 'Male', '1998-06-17', 'suresh123@gmail.com', '9982938299', 'Hyderabad', 1, '2020-08-12 23:29:27', '2020-08-12 23:29:27'),
('surya.56@gmail.com', 'Surya', 'Tej', '591450200823_attendance.JPG', 'Male', '1992-07-09', 'surya.16@gmail.com', '9876564325', 'Tamil Nadu', 0, '2020-08-14 23:59:50', '2020-08-15 00:01:49');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `lid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_on` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_on` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`lid`, `username`, `password`, `last_login`, `created_on`, `modified_on`) VALUES
(2, 'rahul123@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', '2020-08-14 23:19:53', '2020-08-13 04:47:47', '2020-08-14 23:19:53'),
(4, 'suresh123@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', NULL, '2020-08-14 20:03:02', '2020-08-14 20:03:02'),
(6, 'rupa123@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', NULL, '2020-08-14 21:32:25', '2020-08-14 21:32:25'),
(11, 'rajini.st@yahoo.com', '81dc9bdb52d04dc20036dbd8313ed055', '2020-08-14 23:57:40', '2020-08-14 23:57:27', '2020-08-14 23:57:40'),
(13, 'surya.56@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', '2020-08-14 23:59:57', '2020-08-14 23:59:50', '2020-08-14 23:59:57'),
(16, 'poorna', 'd15a667f3e3cc7f6748006c25312a661', '2020-08-15 13:20:38', '2020-08-15 12:57:00', '2020-08-15 13:20:38'),
(19, 'Eswar', '81dc9bdb52d04dc20036dbd8313ed055', NULL, '2020-08-15 13:27:34', '2020-08-15 13:27:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`lid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `lid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
