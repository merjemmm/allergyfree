PRAGMA foreign_keys = ON;

INSERT INTO users(username, fullname, email, password)
VALUES 
    ('baseuser', 'Base User', 'baseusero@umich.edu', 'pass'
    );

-- + sqlite3 -batch -line var/insta485.sqlite3 'SELECT * FROM posts'
INSERT INTO restaurants(location, name, adder, goodexp)
VALUES
    ('Ann Arbor', 'Bodego Bros', 'baseuser', TRUE);

-- example symptom category; see below
INSERT INTO symptomCategories(symptom, type)
VALUES ('migraine', 'brain');

INSERT INTO symptoms(adder, day, month, year, type, notes, symptom)
VALUES
    ('baseuser', 1, 10, 2025, 'brain', 'bad pain', 'migraine'),
    ('baseuser', 2, 10, 2025, 'brain', 'bad pain', 'migraine'),
    ('baseuser', 3, 10, 2025, 'brain', 'bad pain', 'migraine');


-- INSERT INTO journal(location, name, adder)
-- VALUES
--     ("Ann Arbor", "Bodego Bros", '1');