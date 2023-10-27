create table users (
	user_id int not null default FLOOR(RAND() * POWER(2, 32)),
	email text not null,
	username text not null,
	pass_hash char(255) not null,
	primary key (user_id)
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
	foreign key (user_id_1) references users(user_id) on delete cascade on update cascade,
	foreign key (user_id_2) references users(user_id) on delete cascade on update cascade
);

create table transactions (
	transaction_id int not null default FLOOR(RAND() * POWER(2, 32)),
	name varchar(100) not null,
	date date not null,
	amount int not null,
	description text not null,
	primary key (transaction_id)
);

create table transaction_participants (
	transaction_id int not null,
	user_id int not null,
	has_approved tinyint(1) not null,
	amount int not null,
	primary key (transaction_id),
	foreign key (user_id) references users(user_id) on delete no action on update cascade
);

create table debts (
	creditor int not null,
	debtor int not null,
	amount int not null,
	foreign key (creditor) references users(user_id) on delete cascade on update cascade,
	foreign key (debtor) references users(user_id) on delete cascade on update cascade
);

create table groups (
	group_id int not null,
	group_name text not null,
	primary key (group_id)
);

create table group_members (
	group_id int not null,
	user_id int not null,
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade,
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
);

create table group_transactions (
	group_id int not null,
	transaction_id int not null,
	foreign key (group_id) references groups(group_id) on delete cascade on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade
);

create table notifications (
	notification_id int not null,
	user_id int not null,
	type text not null,
	is_approved_transaction tinyint(1) not null,
	is_transaction_approval tinyint(1) not null,
	is_friend_request tinyint(1) not null,
	transaction_id int,
	friend_request_user_id int,
	primary key (notification_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade,
	foreign key (transaction_id) references transactions(transaction_id) on delete cascade on update cascade,
	foreign key (friend_request_user_id) references users(user_id) on delete cascade on update cascade
);

insert into users (user_id, email, username, pass_hash) values
(1, 'Matthew Duphily', 'Roasted715Jr', '$2y$10$FUpW8V.MqjWJj.AK6hJvKePdO/fwHYoxPoBhoTRBDFiUAbK5DEdY.'),
(2, 'Matthew Frances', 'Soap_Ninja', '$2y$10$Ox1lpVPL2uQHy5V0QANdEOHsVW.eIPPrh2TYUr5LxjBc.yb2oiw.u'),
(3, 'Nick Jones', 'Vanquisher', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(4, 'Tester 1', 'tester1', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u'),
(5, 'Tester 2', 'tester2', '$2y$10$OWU6zV8dDl8euugC7nK0SObp.cCZfdjyqPMMnPDEhFJtEX1cC2H9u');

insert into friendships (user_id_1, user_id_2) values
(1, 2),
(1, 3),
(2, 3);

insert into transactions (transaction_id, name, date, amount, description) values
(1, 'Halal Shack', '2023-09-29', 899, 'Bought you fools some food');

insert into groups (group_id, group_name) values
(1, 'CMSC447 Bros'),
(2, 'Matts'),
(3, 'Frances and Testers');

insert into group_members (group_id, user_id) values
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 2),
(3, 2),
(3, 4),
(3, 5);

insert into group_transactions (group_id, transaction_id) values
(1, 1);

insert into debts (creditor, debtor, amount) values
(4, 3, 2300),
(3, 1, 300),
(3, 2, 500),
(4, 5, 700),
(1, 2, 1100),
(2, 4, 1300),
(5, 2, 1700);
