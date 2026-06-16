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
  room VARCHAR(10) NOT NULL,
  capacity INT DEFAULT 5,
  current_count INT DEFAULT 0,
  FOREIGN KEY (building_id) REFERENCES buildings(id)
);

INSERT INTO rooms (building_id, room, capacity, current_count) VALUES
  (1,'B12',5,0),(1,'B13',5,0),(1,'B14',5,0),(1,'B15',5,0),
  (1,'B16',5,0),(1,'B17',5,0),(1,'B18',5,0),(1,'B19',5,0),
  (1,'B20',5,0),(1,'B21',5,0),(1,'B22',5,0),(1,'B23',5,0),(1,'B24',5,0),
  (2,'A6',5,0),(2,'A7',5,0),(2,'A8',5,0),(2,'A9',5,0),
  (2,'A10',5,0),(2,'A11',5,0),(2,'A12',5,0),(2,'A13',5,0),
  (2,'A14',5,0),(2,'A15',5,0),(2,'A16',5,0),(2,'A17',5,0),
  (2,'A18',5,0),(2,'A19',5,0),(2,'A20',5,0),(2,'A21',5,0),
  (2,'A22',5,0),(2,'A23',5,0),(2,'A24',5,0);

-- ============================
-- 4. Registrations
-- ============================
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  gender ENUM('male','female') NOT NULL,
  room_id INT NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);