'use strict';

//============== POPULATING USERS FROM THE DATA ===================

const data = './data/';
const fs = require('fs');
const users = [];

//looping through the data file to get the file names
fs.readdirSync(data).forEach(file => {
  //pushing the contents of the file to the users array
  const json = JSON.parse(require('fs').readFileSync(`${data}${file}`, 'utf8'));
  users.push(json);
});

//exporting the users array
module.exports = users;