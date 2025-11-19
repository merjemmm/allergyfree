PRAGMA foreign_keys = ON;

INSERT INTO users(username, fullname, password)
VALUES 
    ('baseuser', 'Base User', 'pass');

-- + sqlite3 -batch -line var/insta485.sqlite3 'SELECT * FROM posts'
INSERT INTO restaurants(location, name, adder, goodexp)
VALUES
    ('Ann Arbor', 'Bodego Bros', 'baseuser', TRUE);

-- example symptom category; see below
INSERT INTO symptomCategories(symptom, type)
VALUES ('migraine', 'brain');

INSERT INTO symptoms(adder, date, type, notes, symptom)
VALUES
    ('baseuser', CURRENT_TIMESTAMP, 'brain', 'bad pain', 'migraine'),
    ('baseuser', CURRENT_TIMESTAMP, 'brain', 'bad pain', 'migraine'),
    ('baseuser', CURRENT_TIMESTAMP, 'brain', 'bad pain', 'migraine');


INSERT INTO journal(adder, meal, food, ingredients, notes, symptoms)
VALUES
    ('baseuser', "Breakfast", "cereal", "wheat, sugar", "tasty", "Stomachache"),
    ('baseuser', "Lunch", "sandwich", "ham, lettuce", "okay", "None"),
    ('baseuser', "Dinner", "noodles", "rice", "tasty", "None");