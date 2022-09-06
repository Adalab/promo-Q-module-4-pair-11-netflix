const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');


// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});


server.get('/movies', (req, resp) => {
  const response = { "success": true, "movies": movies }
  resp.json(response)
})

const staticServer = './src/public-react';
server.use(express.static(staticServer));

const staticServerImages = './src/public-movies-images';
server.use(express.static(staticServerImages));