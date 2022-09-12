const express = require('express');
const cors = require('cors');
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
    const query = db.prepare(
      `SELECT * FROM movies ORDER BY title ${req.query.sort}`
    );
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
  const queryMovie = db.prepare('SELECT * FROM movies WHERE id=?');
  const foundMovie = queryMovie.get(req.params.movieId);
  console.log(foundMovie);
  res.render('movie', foundMovie);
});

server.post('/login', (req, res) => {
  const queryUsers = db.prepare(
    `SELECT * FROM users WHERE email=? AND password=?`
  );
  const oneUser = queryUsers.get(req.body.email, req.body.password);
  console.log('Esto es oneUser', oneUser);

  if (oneUser) {
    res.json({ success: true, userId: oneUser.id });
  } else {
    res.json({ success: false, errorMessage: 'Usuaria/o no encontrada/o' });
  }
});

server.post('/signup', (req, res) => {
  if ((req.body.email !== '', req.body.password !== '')) {
    const queryNewUser = db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)'
    );
    const newUser = queryNewUser.run(req.body.email, req.body.password);
    console.log(newUser);
    const responseSuccess = {
      success: true,
      userId: newUser.lastInsertRowid,
    };
    res.json(responseSuccess);
  } else {
    const responseError = {
      success: false,
      error: 'falta completar',
    };
    res.json(responseError);
  }
});

const staticServer = './src/public-react';
server.use(express.static(staticServer));

const staticServerImages = './src/public-movies-images';
server.use(express.static(staticServerImages));

const staticServerStyles = './src/public-css';
server.use(express.static(staticServerStyles));
