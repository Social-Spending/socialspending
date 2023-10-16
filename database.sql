-- SQL to setup the social_spending database

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2023 at 01:44 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
-- Table structure for table `cookies`
--

CREATE TABLE `cookies` (
  `session_id` char(64) NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cookies`
--


-- --------------------------------------------------------

--
-- Table structure for table `debts`
--

CREATE TABLE `debts` (
  `creditor_id` int(11) NOT NULL,
  `debtor_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `amount` int(11) NOT NULL COMMENT 'The amount the specified user owes/is owed in this transaction. If negative, the user is a creditor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Links users to transactions';

--
-- Dumping data for table `transaction_participants`
--

INSERT INTO `transaction_participants` (`transaction_id`, `UID`, `has_approved`, `amount`) VALUES
(1, 1, 0, 20),
(1, 2, 0, 10),
(1, 3, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL COMMENT 'User ID',
  `email` text NOT NULL COMMENT 'User''s email',
  `username` text NOT NULL COMMENT 'User''s username',
  `pass_hash` char(255) NOT NULL COMMENT 'User''s password hash'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
-- All users have default password of 'password'
--

INSERT INTO `users` (`uid`, `email`, `username`, `pass_hash`) VALUES
(1, 'Matthew Duphily', 'Roasted715Jr', '$2y$10$FUpW8V.MqjWJj.AK6hJvKePdO/fwHYoxPoBhoTRBDFiUAbK5DEdY.'),
(2, 'Matthew Frances', 'Soap_Ninja', '$2y$10$Ox1lpVPL2uQHy5V0QANdEOHsVW.eIPPrh2TYUr5LxjBc.yb2oiw.u'),
(3, 'Nick Jones', 'Vanquisher', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cookies`
--
ALTER TABLE `cookies`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `cookies_ibfk_1` (`uid`);

--
-- Indexes for table `debts`
--
ALTER TABLE `debts`
  ADD KEY `creditor` (`creditor_id`),
  ADD KEY `debtor` (`debtor_id`);

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
  ADD PRIMARY KEY (`uid`),
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
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID', AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cookies`
--
ALTER TABLE `cookies`
  ADD CONSTRAINT `cookies_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `debts`
--
ALTER TABLE `debts`
  ADD CONSTRAINT `debts_ibfk_1` FOREIGN KEY (`creditor_id`) REFERENCES `users` (`UID`),
  ADD CONSTRAINT `debts_ibfk_2` FOREIGN KEY (`debtor_id`) REFERENCES `users` (`UID`);

--
-- Constraints for table `friendships`
--
ALTER TABLE `friendships`
  ADD CONSTRAINT `friendships_ibfk_1` FOREIGN KEY (`UID_1`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friendships_ibfk_2` FOREIGN KEY (`UID_2`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `group_transactions`
--
ALTER TABLE `group_transactions`
  ADD CONSTRAINT `group_transactions_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `group_transactions_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
