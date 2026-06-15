CREATE DATABASE `KTX`;
USE `KTX`;

-- ============================
-- 1. User
-- ============================
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`username`, `password`) VALUES
  ('admin', 'pass');

-- ============================
-- 2. Buildings
-- ============================
CREATE TABLE buildings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

INSERT INTO buildings (name) VALUES ('Nam'), ('Nữ');

-- ============================
-- 3. Rooms
-- ============================
CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  building_id INT NOT NULL,
  room_number VARCHAR(10) NOT NULL,
  capacity INT DEFAULT 4,
  current_count INT DEFAULT 0,
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

INSERT INTO rooms (building_id, room_number, capacity, current_count) VALUES
  (1,'101',4,0),(1,'102',4,0),(1,'103',4,0),(1,'104',4,0),(1,'105',4,0),
  (1,'106',4,0),(1,'107',4,0),(1,'108',4,0),(1,'109',4,0),(1,'110',4,0),
  (2,'201',4,0),(2,'202',4,0),(2,'203',4,0),(2,'204',4,0),(2,'205',4,0),
  (2,'206',4,0),(2,'207',4,0),(2,'208',4,0),(2,'209',4,0),(2,'210',4,0);

-- ============================
-- 4. Registrations
-- ============================
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  gender ENUM('male','female') NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  room_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);