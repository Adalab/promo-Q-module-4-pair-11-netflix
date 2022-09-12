const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '10mb' }));

server.set('view engine', 'ejs');

// confituración database
const db = new Database('./src/db/database.db', {
  verbose: console.log,
});

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, resp) => {
  if (req.query.gender === '') {
    const query = db.prepare(`SELECT * FROM movies ORDER BY title ${req.query.sort}`);
    /*   const response = { success: true, movies: movies }; */
    const response = query.all();
    resp.json({ success: true, movies: response });
    return;
  } else {
    const query = db.prepare(
      `SELECT * FROM movies WHERE gender=? ORDER BY title ${req.query.sort}`
    );
    const response = query.all(req.query.gender);
    resp.json({ success: true, movies: response });
    return;
  }
});


server.get('/movie/:movieId', (req, res) => {
  const foundMovie = movies.find(
    (oneMovie) => oneMovie.id === req.params.movieId
  );
  console.log(foundMovie);
  res.render('movie', foundMovie);
});

const staticServer = './src/public-react';
server.use(express.static(staticServer));

const staticServerImages = './src/public-movies-images';
server.use(express.static(staticServerImages));
