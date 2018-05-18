'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const moment = require('moment');
const users = require('./users');


// app.use(bodyParser.json());
app.use(morgan('tiny'));


app.get('/', (req, res) => {
  const response = {
    length: users.length,
    users
  };
  res.json(response);
});

app.get('/:id', (req, res) => {
  const answers = {
    threeInRow: 0,
    tenInWeek: 0
  };


  //filter for user_id coming in
  //assuming it's a valid id at this point
  //sort in chronological order based on start time of activity
  //currently useing library for ease
  const userSessions = users
    .filter(user => user.user_id === req.params.id) 
    .sort((a, b) => moment(a.start) - moment(b.start));

    //question 1:  Return how many times ran > 1km three times in a row
  let runCounter = 1;

  for (let i = 0; i < userSessions.length - 1; i++){

    if(runCounter === 3){
      answers.threeInRow++;
      runCounter = 1;
    }
    // console.log('user[i+1]', user[i+1]);

    const thisSession = userSessions[i];
    const nextSession = userSessions[i+1];
    const today = moment(thisSession.start).calendar();
    const tomorrow = moment(today).add(1, 'days').calendar();
    const nextDate = moment(nextSession.start).calendar();

    if(thisSession.type === 'run' && thisSession.distance > 1){
      console.log('tomorrow:', tomorrow, 'nextDate:', nextDate, tomorrow === nextDate);
      if(tomorrow === nextDate){
        runCounter++;
      }
      else{ runCounter = 1;}
    }
    console.log('runCounter', runCounter);
  }

  console.log('answers.threeInRow', answers.threeInRow);


 
  const tenSessions = userSessions.slice(0, 9);
  res.json(tenSessions);
  // res.json(shortUser.map(i => moment(i.start).add(1, 'days').format('dddd')));
  // res.json(shortUser.map(i => i.type));
});








//============ PORT LISTENING ==============================

app.listen(8080, function () {
  console.log('Example app listening on port 8080');
});



//single user id as input
// return how many times >1km in a single run 3 days in a row
// only 6 days === 2, not 4

//more that 10km in a calendar week (start Monday, end Sunday)

//make third rule

//output json



// first thing is to search the dataset for all items where user_id === input;
// store as an array of objects?

// each time we find one, we need to figure out some different things:
// we probably want to sort by date
 
// to answer first question, we need to know 
// if distance > 1
// count for if start day === previous start day + 1
// count for when consec start day === 3

// to answer second question, we need 
// to sort into weeks
// counter for each week, if sum of distance > 10
  