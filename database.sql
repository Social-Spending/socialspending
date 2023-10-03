-- database.sql
-- This is a copy of the SQL instructions used to create the tables of the social_spending database

-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 29, 2023 at 02:22 PM
-- Server version: 10.6.12-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `social_spending`
--

-- --------------------------------------------------------

--
-- Table structure for table `friendships`
--

CREATE TABLE `friendships` (
  `UID_1` int(11) NOT NULL,
  `UID_2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `friendships`
--

INSERT INTO `friendships` (`UID_1`, `UID_2`) VALUES
(1, 2),
(1, 3),
(2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`) VALUES
(1, 'CMSC447 Bros');

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `group_id` int(11) NOT NULL,
  `UID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Links groups and users that are a member of that group';

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`group_id`, `UID`) VALUES
(1, 1),
(1, 2),
(1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `group_transactions`
--

CREATE TABLE `group_transactions` (
  `group_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Links groups and transactions made inside that group';

--
-- Dumping data for table `group_transactions`
--

INSERT INTO `group_transactions` (`group_id`, `transaction_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `name`, `date`, `description`) VALUES
(1, 'Halal Shack', '2023-09-29', 'Bought you fools some food');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_participants`
--

CREATE TABLE `transaction_participants` (
  `transaction_id` int(11) NOT NULL,
  `UID` int(11) NOT NULL,
  `has_approved` tinyint(1) NOT NULL COMMENT 'Whether the specified user has approved this transaction',
  `is_creditor` tinyint(1) NOT NULL COMMENT 'Whether the specified user is the creditor for this transaction. Each transaction can only have one creditor',
  `amount` int(11) NOT NULL COMMENT 'The amount the specified user owes/is owed in this transaction'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Links users to transactions';

--
-- Dumping data for table `transaction_participants`
--

INSERT INTO `transaction_participants` (`transaction_id`, `UID`, `has_approved`, `is_creditor`, `amount`) VALUES
(1, 1, 0, 1, 20),
(1, 2, 0, 0, 10),
(1, 3, 1, 0, 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UID` int(11) NOT NULL COMMENT 'User ID',
  `email` text NOT NULL COMMENT 'User''s email',
  `username` text NOT NULL COMMENT 'User''s username',
  `pass_hash` text NOT NULL COMMENT 'User''s password hash'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UID`, `email`, `username`, `pass_hash`) VALUES
(1, 'Matthew Duphily', 'Roasted715Jr', 'pass'),
(2, 'Matthew Frances', 'Soap_Ninja', 'pass'),
(3, 'Nick Jones', 'Vanquisher', 'pass');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friendships`
--
ALTER TABLE `friendships`
  ADD KEY `UID_1` (`UID_1`),
  ADD KEY `UID_2` (`UID_2`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD UNIQUE KEY `UID` (`UID`),
  ADD KEY `group_id` (`group_id`) USING BTREE;

--
-- Indexes for table `group_transactions`
--
ALTER TABLE `group_transactions`
  ADD KEY `group_id` (`group_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `transaction_participants`
--
ALTER TABLE `transaction_participants`
  ADD KEY `UID` (`UID`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UID`),
  ADD UNIQUE KEY `username` (`username`) USING HASH,
  ADD UNIQUE KEY `email` (`email`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction_participants`
--
ALTER TABLE `transaction_participants`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID', AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`UID_1`) REFERENCES `users` (`UID`),
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`UID_2`) REFERENCES `users` (`UID`);

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`);

--
-- Constraints for table `group_transactions`
--
ALTER TABLE `group_transactions`
  ADD CONSTRAINT `group_transactions_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  ADD CONSTRAINT `group_transactions_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`);

--
-- Constraints for table `transaction_participants`
--
ALTER TABLE `transaction_participants`
  ADD CONSTRAINT `transaction_participants_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  ADD CONSTRAINT `transaction_participants_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
