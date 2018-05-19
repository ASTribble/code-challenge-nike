'use strict';

//============== POPULATING USERS FROM THE DATA ===================

const data = './data/';
const fs = require('fs');
const activities = [];

//looping through the data file to get the file names
fs.readdirSync(data).forEach(file => {
  //pushing the contents of the file to the activities array
  const json = JSON.parse(fs.readFileSync(`${data}${file}`, 'utf8'));
  activities.push(json);
});

//exporting the activities array
module.exports = activities;