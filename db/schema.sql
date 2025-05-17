CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    authority VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- passwordは"smith"
insert into users (username,email,password,authority)
values('smith01','01@smith.com','$2a$10$OK4RSiU1dlYh1OS636i6nO5JWIMLxB521z9V0YHg3KyamtB7ChV9i','ADMIN');

CREATE TABLE IF NOT EXISTS decks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    deck_name VARCHAR(255) NOT NULL,
    deck_description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deck_attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL,
    attribute_name VARCHAR(255) NOT NULL,
    is_front INT NOT NULL,
    is_primary INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS card_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    deck_attribute_id INT NOT NULL,
    attribute_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_attribute_id) REFERENCES deck_attributes(id) ON DELETE CASCADE
);

drop table decks, deck_attributes, cards, card_values;

insert into decks(user_id,deck_name,deck_description) values (1,'deck_name','deck_description');
insert into deck_attributes(deck_id,attribute_name,is_front,is_primary) values(1,'attribute_name1',1,1);
insert into deck_attributes(deck_id,attribute_name,is_front,is_primary) values(1,'attribute_name2',1,0);
insert into deck_attributes(deck_id,attribute_name,is_front,is_primary) values(1,'attribute_name3',0,1);
insert into cards(deck_id) values(1);
insert into card_values(card_id,deck_attribute_id,attribute_value) values(1,1,'front card values');
insert into card_values(card_id,deck_attribute_id,attribute_value) values(1,3,'back card values');

