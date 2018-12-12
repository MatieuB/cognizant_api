DROP TABLE IF EXISTS albums;

DELETE * FROM albums;

CREATE TABLE albums(id serial NOT NULL, album varchar(45) NOT NULL, artist varchar(45) NOT NULL, genre varchar(45) NOT NULL,year varchar(4));

INSERT INTO albums(id, album, artist, genre, year) VALUES(default, 'u2', 'bono', 'rock', '1981');