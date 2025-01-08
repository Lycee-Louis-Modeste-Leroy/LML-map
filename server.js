const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});