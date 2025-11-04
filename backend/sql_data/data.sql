PRAGMA foreign_keys = ON;

INSERT INTO users(username, fullname, email, password)
VALUES 
    ('baseuser', 'Base User', 'baseusero@umich.edu',
    'sha512$34e94a05cdf247db92a84bc590950336$7eaca2b4169e042120f015666115856c717343f1c75d1c1bd1bf469bd1cd439eb152ccda6a0b8703706dfbcb861b3cef9208325c31f436e8edb9563f01176c48'
    );

-- + sqlite3 -batch -line var/insta485.sqlite3 'SELECT * FROM posts'
INSERT INTO restaurants(location, name, adder)
VALUES
    ("Ann Arbor", "Bodego Bros", '1');

