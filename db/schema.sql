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

CREATE TABLE IF NOT EXISTS cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL,
    sentence VARCHAR(255) NOT NULL,
    word VARCHAR(255) NOT NULL,
    pronounce VARCHAR(255),
    meaning VARCHAR(255),
    translate VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review_intervals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT NOT NULL,
    success_count INT NOT NULL,
    next_review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

insert into decks(user_id,deck_name,deck_description) values (1,'deck_name','deck_description');
insert into decks(user_id,deck_name,deck_description) values (1,'deck_name2','deck_description2');
insert into cards(deck_id,sentence,word,pronounce,meaning,translate)
values(1,'sentence1','word1','pronounce1','meaning1','translate1');
insert into cards(deck_id,sentence,word,pronounce,meaning,translate)
values(1,'sentence2','word2','pronounce2','meaning2','translate2');
insert into cards(deck_id,sentence,word,pronounce,meaning,translate)
values(1,'sentence3','word3','pronounce3','meaning3','translate3');
insert into review_intervals(card_id,success_count,next_review_date)
values(1,0,'2025-05-18');
insert into review_intervals(card_id,success_count,next_review_date)
values(2,0,'2025-05-18');

drop table review_intervals,cards, decks;
