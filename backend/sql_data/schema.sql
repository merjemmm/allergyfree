PRAGMA foreign_keys = ON;

-- tracks all users
CREATE TABLE users(
  -- userid INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(20) PRIMARY KEY,
  fullname VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(256) NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- tracks restaurants they have gone to
CREATE TABLE restaurants(
  restid INTEGER PRIMARY KEY AUTOINCREMENT,
  location VARCHAR(64) NOT NULL,
  name VARCHAR(20) NOT NULL,
  adder VARCHAR(20) NOT NULL,
  goodexp BOOLEAN NOT NULL,
  created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY(adder) REFERENCES users(username) ON DELETE CASCADE
);

-- tracks symptoms they have had
CREATE TABLE symptoms(
  dateid INTEGER PRIMARY KEY AUTOINCREMENT,
  adder VARCHAR(20) NOT NULL,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  notes VARCHAR(200) NOT NULL,
  symptom  VARCHAR(20) NOT NULL,
  FOREIGN KEY(adder) REFERENCES users(username) ON DELETE CASCADE
  FOREIGN KEY(symptom) REFERENCES symptomCategories(symptom) ON DELETE CASCADE
);

-- categories for user symptoms
-- TODO, need some db or otherwise that says what symptoms a user has chosen
CREATE TABLE symptomCategories(
  symptomid INTEGER PRIMARY KEY AUTOINCREMENT,
  symptom VARCHAR(40) NOT NULL,
  type  VARCHAR(40) NOT NULL,
);

-- tracks foods they have eaten
CREATE TABLE journal(
  symptomid INTEGER PRIMARY KEY AUTOINCREMENT,
  adder VARCHAR(20) NOT NULL,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  meal VARCHAR(20) NOT NULL,
  name VARCHAR(20) NOT NULL,

  FOREIGN KEY(adder) REFERENCES users(username) ON DELETE CASCADE
);
