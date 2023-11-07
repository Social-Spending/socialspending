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
	description text not null,
	primary key (transaction_id)
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
	amount int not null,
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

create table group_transactions (
	group_id int not null,
	transaction_id int not null,
	primary key (group_id, transaction_id),
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade
);

create table notifications (
	notification_id int not null AUTO_INCREMENT,
	user_id int not null,
	type text not null,
	transaction_id int,
	friend_request_user_id int,
	primary key (notification_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade,
	foreign key (friend_request_user_id) references users(user_id) on delete cascade on update cascade
);

insert into users (user_id, email, username, pass_hash) values
(1, 'MDuphily@socialspendingapp.com', 'Roasted715Jr', '$2y$10$FUpW8V.MqjWJj.AK6hJvKePdO/fwHYoxPoBhoTRBDFiUAbK5DEdY.'),
(2, 'MFrances@socialspendingapp.com', 'Soap_Ninja', '$2y$10$Ox1lpVPL2uQHy5V0QANdEOHsVW.eIPPrh2TYUr5LxjBc.yb2oiw.u'),
(3, 'NJones@socialspendingapp.com', 'Vanquisher', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(4, 'RReed@socialspendingapp.com', 'Vasagle', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(5, 'BJTNoguera@socialspendingapp.com', 'level_five_yeti', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u');

insert into friendships (user_id_1, user_id_2) values
(1, 2),
(1, 3),
(2, 3);

insert into transactions (transaction_id, name, date, amount, description) values
(1, 'Halal Shack', '2023-09-29', 899, 'Bought you fools some food'),
(2, 'Gas Money', '2023-10-30', 500, 'Thx for driving!'),
(3, 'Coffee Run', '2023-10-25', 1200, '');

insert into transaction_participants (transaction_id, user_id, has_approved, amount) values
(1, 1, 1, -899),
(1, 2, 1, 500),
(1, 3, 1, 399),
(2, 1, 0, 500),
(2, 2, 1, -500),
(3, 3, 1, -1200),
(3, 1, 1, 400),
(3, 2, 1, 500),
(3, 4, 1, 300);


insert into groups (group_id, group_name, icon_path) values
(1, 'CMSC447 Bros', '/group_icons/4171f2bc82fa8a491c5734259ff9799e1e08b4ee.gif'),
(2, 'Matts', NULL);

insert into group_members (group_id, user_id) values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 2);

insert into group_transactions (group_id, transaction_id) values
(1, 1),
(2, 2),
(1, 3);

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

