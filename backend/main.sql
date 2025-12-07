CREATE DATABASE IF NOT EXISTS StreetFoodDB
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;
USE StreetFoodDB;


CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','owner') NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(80),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE FoodStands (
  stand_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  location VARCHAR(150),
  category VARCHAR(50),
  owner_id INT NOT NULL,
  opening_hours VARCHAR(100),
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stand_owner
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_owner_name (owner_id, name)
) ENGINE=InnoDB;

CREATE TABLE MenuItems (
  item_id INT PRIMARY KEY AUTO_INCREMENT,
  stand_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(8,2) NOT NULL,
  is_vegan TINYINT(1) NOT NULL DEFAULT 0,
  available TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_item_stand
    FOREIGN KEY (stand_id) REFERENCES FoodStands(stand_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Reviews (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  stand_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(120),
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT,
  likes INT NOT NULL DEFAULT 0,
  reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  CONSTRAINT fk_review_stand
    FOREIGN KEY (stand_id) REFERENCES FoodStands(stand_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_review_user
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  UNIQUE KEY uniq_user_stand (stand_id, user_id)  -- 1 review per user per stand
) ENGINE=InnoDB;

-- Users de démo : tous les mots de passe sont "password123"
-- Les hash bcrypt ont été générés avec 10 rounds de salt
INSERT INTO Users (name,email,password_hash,role,phone,city) VALUES
('Maya Lopez','maya@example.com','$2b$10$6HoJVR2Pu/ULiBvdKAB1vOZ7MkWGTfCshEXJL.A5fQi8T3GABTkXi','owner','+33 600000001','Paris'),
('Kenji Ito','kenji@example.com','$2b$10$ZPyAtTVL8YLxEvdWO.BsROl31VYdJGpqH3oTbdbqVSxlaHB6WCnOS','owner','+33 600000002','Lyon'),
('Sofia Rossi','sofia@example.com','$2b$10$uvmOu30WLWgdSvaJLvpZueTAO3NyBGnH0jKQRmhRczbqoFDsjZ3JK','owner','+33 600000003','Marseille'),
('Omar Haddad','omar@example.com','$2b$10$AcjtyPuuzbYXGmnswfj10u7Q.t7UGQYXVcJrInjaiMgB/Qodg1ksm','owner','+33 600000004','Toulouse'),
('Nina Kovac','nina@example.com','$2b$10$RkuewW1270YuA824NylcL.a.d.xn1T/RaXoX1QaFs1eHHR8cR94OO','owner','+33 600000005','Bordeaux'),
('Ava Martin','ava@example.com','$2b$10$gKHGRrG3KkxiVsucC3cOVuNGaTFoUXwxSVR/U.zYinUka8Hi34dg2','customer','+33 600000006','Paris'),
('Liam Chen','liam@example.com','$2b$10$W55BN84GK9BmVlB0kzhyYuLOgnlCGGuKx8d0QI0zmoPvOXRVormkm','customer','+33 600000007','Lyon'),
('Zoe Dubois','zoe@example.com','$2b$10$ssvv/vPULLfOy8IoNbarzOTNdnX.44atQskBpgMI05fKtyUyEmm7O','customer','+33 600000008','Lille'),
('Hugo Morel','hugo@example.com','$2b$10$PDVqb2rpzlVGfQfw7CU6gu2Cq8/WlMuVmsnHdy.HO3u4MMw8LpH7O','customer','+33 600000009','Nantes'),
('Lea Bernard','lea@example.com','$2b$10$c6mBeN1J.EgpH7WFNevoCOUGsKomfmCNMPVdbdytynIv14SDAa6c2','customer','+33 600000010','Nice'),
('Ibrahim Diallo','ibra@example.com','$2b$10$d3IHA78QPwUxNEszbEm7Y.3BFJfUopbPU8RHCkU5.Fwxh7reRrRuy','customer','+33 600000011','Grenoble'),
('Clara Schmidt','clara@example.com','$2b$10$sqWGUNFGaWmBuxOLDvNGx.4D/RFFdHcwUeJuL4Zxf3edY8GB3GP1.','customer','+33 600000012','Strasbourg'),
('Pablo Garcia','pablo@example.com','$2b$10$iBDFHuxdKmNIOY5jBBNGSOKrBohGzs.d8KZZ/gPwDdr0ZbqmMUiYm','customer','+33 600000013','Montpellier'),
('Yuki Tanaka','yuki@example.com','$2b$10$cjos9o0d2HzvugCrKQmh6e20cY96XAFuaZ6mgwjrMDNG6m.5ILpEi','customer','+33 600000014','Rennes'),
('Ana Silva','ana@example.com','$2b$10$Ioux7NwmwKOwlzOmtrAip.zpG4nKb6p3i22ovhdaOrgNQEM9IrXDy','customer','+33 600000015','Paris');


INSERT INTO FoodStands (name,location,category,owner_id,opening_hours,is_active) VALUES
('Taco Loco','Main Square','tacos',1,'Mon-Sun 11:00-22:00',1),
('Noodle Ninja','Park Street','noodles',2,'Tue-Sun 12:00-21:00',1),
('Falafel Fly','Riverside','falafel',1,'Mon-Fri 11:30-20:30',1),
('Burger Barn','Old Town','burgers',3,'Daily 12:00-23:00',1),
('Curry Cart','Market Lane','curry',4,'Wed-Mon 11:00-20:00',1),
('Crêpe Corner','Cathedral Sq','crepe',5,'Daily 10:00-22:00',1),
('Kebab King','City Gate','kebab',3,'Daily 11:00-02:00',1),
('Gyro Gyro','Harbor','gyro',4,'Thu-Sun 13:00-22:00',1),
('Bao Bus','Tech Park','bao',2,'Mon-Fri 11:30-14:30',1),
('Sushi Street','Riverwalk','sushi',2,'Tue-Sun 12:00-21:30',1),
('Veggie Van','University','vegan',5,'Mon-Fri 10:00-18:00',1),
('Tostada Truck','Stadium','mexican',1,'Matchdays 15:00-23:00',1),
('Churro Chariot','Main Square','dessert',5,'Evenings 17:00-22:00',1),
('Pho Wheel','Old Port','soup',2,'Daily 11:00-20:00',1),
('Arepa Alley','South Market','arepa',4,'Daily 12:00-21:00',1);

INSERT INTO MenuItems (stand_id,name,description,price,is_vegan,available) VALUES
(1,'Al Pastor Taco','Pineapple & pork',3.50,0,1),
(1,'Carnitas Taco','Slow-cooked pork',3.20,0,1),
(2,'Ramen Bowl','Shoyu broth',9.90,0,1),
(3,'Classic Falafel','Herb-packed balls',5.50,1,1),
(4,'Cheese Burger','150g beef & cheddar',7.90,0,1),
(5,'Butter Chicken Curry','Creamy tomato sauce',8.90,0,1),
(6,'Nutella Crêpe','Sweet classic',4.20,0,1),
(7,'Kebab Wrap','Lamb, garlic sauce',6.50,0,1),
(8,'Pork Gyro','Fries & tzatziki',6.90,0,1),
(9,'Char Siu Bao','BBQ pork bun',3.00,0,1),
(10,'Salmon Nigiri (2pc)','Fresh salmon',4.80,0,1),
(11,'Veggie Bowl','Grains & greens',7.20,1,1),
(12,'Tostada Supreme','Beef, beans, salsa',6.80,0,1),
(13,'Churros (6pc)','Cinnamon sugar',4.00,0,1),
(14,'Pho Bo','Beef noodle soup',9.50,0,1);

INSERT INTO MenuItems (stand_id,name,description,price,is_vegan,available) VALUES
(15,'Reina Arepa','Cheese & ham',6.20,0,1);


INSERT INTO Reviews (stand_id,user_id,title,rating,comment,likes) VALUES
(1,6,'Insane flavor',5,'Best tacos here.',4),
(1,7,'Tasty but spicy',4,'Great, a bit hot.',2),
(2,6,'Solid ramen',4,'Broth is deep.',1),
(3,8,'So fresh',5,'Crispy falafel!',3),
(4,9,'Big burger',4,'Juicy patty.',1),
(5,10,'Rich curry',5,'Butter chicken 10/10.',2),
(6,11,'Sweet treat',4,'Crêpe was perfect.',0),
(7,12,'Late-night savior',5,'Open till 2am!',5),
(8,13,'Good gyro',4,'Nice fries inside.',1),
(9,14,'Bao wow',5,'Soft and tasty.',2),
(10,15,'Fresh fish',5,'Nigiri melted.',3),
(11,6,'Healthy & good',4,'Nice portions.',1),
(12,7,'Game day hit',5,'Fast service.',2),
(13,8,'Great dessert',4,'Churros crispy.',1),
(14,9,'Comforting pho',5,'Aromatic broth.',2);
