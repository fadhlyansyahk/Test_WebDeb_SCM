-- Buat database
CREATE DATABASE IF NOT EXISTS db_scm2;
USE db_scm2;

-- Tabel users (menyimpan data akun)
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(191) NOT NULL,
  email    VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(191) NOT NULL
);

-- Tabel tasks (menyimpan data task milik user)
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(191) NOT NULL,
  description VARCHAR(191),
  status      ENUM('PENDING', 'DONE') NOT NULL DEFAULT 'PENDING',
  userId      INT NOT NULL,
  createdAt   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (userId) REFERENCES users(id)
);
