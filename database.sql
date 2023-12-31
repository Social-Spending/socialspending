DROP TABLE IF EXISTS cookies, friendships, debts, transaction_participants, group_members, notifications, transactions, groups, users, forgotten_passwords;
create table users (
	user_id int not null AUTO_INCREMENT,
	email text not null,
	username text not null unique,
	pass_hash char(255) not null,
	icon_path text null,
	primary key (user_id),
	FULLTEXT(username, email)
);

create table groups (
	group_id int not null AUTO_INCREMENT,
	group_name text not null,
	icon_path text null,
	primary key (group_id)
);

create table transactions (
	transaction_id int not null AUTO_INCREMENT,
	name varchar(100) not null,
	date date not null,
	amount int not null,
	receipt_path text null,
	description text not null,
	group_id int null,
	primary key (transaction_id),
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade
);

create table cookies (
	session_id char(64) not null,
	user_id int default null,
	expiration_date timestamp null default null,
	primary key (session_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
);

create table friendships (
	user_id_1 int not null,
	user_id_2 int not null,
	primary key (user_id_1, user_id_2),
	foreign key (user_id_1) references users(user_id) on delete cascade on update cascade,
	foreign key (user_id_2) references users(user_id) on delete cascade on update cascade
);

create table transaction_participants (
	transaction_id int not null,
	user_id int not null,
	has_approved tinyint(1) not null,
	paid int not null,
	spent int not null,
	primary key (transaction_id, user_id),
	foreign key (user_id) references users(user_id) on delete no action on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade
);

create table debts (
	creditor int not null,
	debtor int not null,
	amount int not null,
	primary key (creditor, debtor),
	foreign key (creditor) references users(user_id) on delete cascade on update cascade,
	foreign key (debtor) references users(user_id) on delete cascade on update cascade
);

create table group_members (
	group_id int not null,
	user_id int not null,
	primary key (group_id, user_id),
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade,
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
);

create table notifications (
	notification_id int not null AUTO_INCREMENT,
	user_id int not null,
	type text not null,
	transaction_id int null default null,
	friend_request_user_id int null default null,
	group_id int null default null,
	notification_timestamp timestamp null default CURRENT_TIMESTAMP,
	primary key (notification_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade,
	foreign key (friend_request_user_id) references users(user_id) on delete cascade on update cascade,
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade
);

create table forgotten_passwords (
	user_id int not null,
	access_code char(255) not null,
	expiration_date timestamp null default null,
	primary key (user_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
);

insert into users (user_id, email, username, pass_hash) values
(1, 'fg53416@umbc.edu', 'Roasted715Jr', '$2y$10$FUpW8V.MqjWJj.AK6hJvKePdO/fwHYoxPoBhoTRBDFiUAbK5DEdY.'),
(2, 'mfrance2@umbc.edu', 'Soap_Ninja', '$2y$10$Ox1lpVPL2uQHy5V0QANdEOHsVW.eIPPrh2TYUr5LxjBc.yb2oiw.u'),
(3, 'njones9@umbc.edu', 'Vanquisher', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(4, 'rreed2@umbc.edu', 'Vasagle', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(5, 'is83652@umbc.edu', 'level_five_yeti', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u');

insert into friendships (user_id_1, user_id_2) values
(1, 2),
(1, 3),
(2, 3);

insert into groups (group_id, group_name, icon_path) values
(1, 'CMSC447 Bros', NULL),
(2, 'Matts', NULL);

insert into transactions (transaction_id, name, date, amount, description, group_id) values
(1, 'Halal Shack', '2023-09-29', 999, 'Bought you fools some food', 1),
(2, 'Gas Money', '2023-10-30', 500, 'Thx for driving!', 2),
(3, 'Coffee Run', '2023-10-25', 1400, '', 1);

insert into transaction_participants (transaction_id, user_id, has_approved, paid, spent) values
(1, 1, 1, 999, 100),
(1, 2, 1, 0, 500),
(1, 3, 1, 0, 399),
(2, 1, 0, 0, 500),
(2, 2, 1, 500, 0),
(3, 3, 1, 1400, 200),
(3, 1, 1, 0, 400),
(3, 2, 1, 0, 500),
(3, 4, 1, 0, 300);


insert into group_members (group_id, user_id) values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 2);

insert into debts (creditor, debtor, amount) values
(1, 2, 500),
(1, 3, 001),
(3, 2, 500),
(3, 4, 300);

INSERT INTO `notifications` (`notification_id`, `user_id`, `type`, `transaction_id`, `friend_request_user_id`) VALUES
('1', '1', 'friend_request', NULL, '4'),
('2', '1', 'friend_request', NULL, '5'),
('3', '1', 'approved_transaction', '1', NULL),
('4', '1', 'approved_transaction', '3', NULL),
('5', '1', 'approval_request', '2', NULL),
('6', '2', 'approved_transaction', '3', NULL),
('7', '3', 'approved_transaction', '3', NULL),
('8', '4', 'approved_transaction', '3', NULL),
('9', '2', 'approved_transaction', '1', NULL),
('10', '3', 'approved_transaction', '1', NULL);

/* Enable event scheduling (automatic query execution, cron-esque*/
SET GLOBAL event_scheduler = ON;

/* Delete Expired Cookies every 12 hours*/
DROP EVENT IF EXISTS DeleteExpiredCookies;

CREATE EVENT DeleteExpiredCookies
ON SCHEDULE EVERY 12 HOUR
DO
	DELETE FROM `cookies`
	WHERE NOW() > 'expiration_date'; 

DROP EVENT IF EXISTS DeleteExpiredAccessCodes;

CREATE EVENT DeleteExpiredAccessCodes
ON SCHEDULE EVERY 12 HOUR
DO
	DELETE FROM `forgotten_passwords`
	WHERE NOW() > 'expiration_date';