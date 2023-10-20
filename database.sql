-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- START TRANSACTION;
-- SET time_zone = "+00:00";

create table users (
	user_id int not null default FLOOR(RAND() * POWER(2, 32)),
	email text not null,
	username text not null,
	pass_hash char(255) not null,
	primary key (user_id)
); -- ENGINE=InnoDB default CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

create table cookies (
	session_id char(64) not null,
	user_id int default null,
	expiration_date timestamp null default null,
	primary key (session_id),
	foreign key (user_id) references users(user_id) on delete cascade on update cascade
); -- ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

create table friendships (
	user_id_1 int not null,
	user_id_2 int not null,
	foreign key (user_id_1) references users(user_id) on delete cascade on update cascade,
	foreign key (user_id_2) references users(user_id) on delete cascade on update cascade
);

create table transactions (
	transaction_id int not null default FLOOR(RAND() * POWER(2, 32)),
	user_id int not null,
	has_approved tinyint(1) not null,
	amount int not null,
	primary key (transaction_id),
	foreign key (user_id) references users(user_id) on delete no action on update cascade
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

);

create table group_members (

);

create table group_transactions(

);
