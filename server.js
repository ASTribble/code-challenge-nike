'use strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const moment = require('moment');

const activities = require('./activities');

app.use(morgan('tiny'));

// this endpoint will return all of the json files from the data set as well as it's length
// and makes it easy to find a valid user_id to test with.
// I'm making all the assumptions that the data is good, valid, and consistent, and that there will be no errors

app.get('/', (req, res, err) => {
  const response = {
    'number of entries': activities.length,
    activities
  };
  res.json(response);
});


// this endpoint will be returning the information about a given user
// i'm again assuming the req.params.id is a valid one and will not have errors

app.get('/:id', (req, res) => {

  // answers will store the answers to all the questions for ease of returning
  const answers = {
    user: req.params.id,
    threeInRow: 0,
    tenInWeek: 0,
    shortestStride: null,
    longestStride: null
  };

  //filter the activities data for a match to the user_id coming in
  //sort in chronological order based on start time of activity
  //currently using a library - moment - for easy date manipulation and comparison 

  const userRuns = activities
    .filter(user => (user.user_id === req.params.id) && (user.type === 'run'))
    .sort((a, b) => moment(a.start) - moment(b.start));

  
  //===== QUESTION 1: =============================================
  //+++++ Return how many times ran > 1km three days in a row ++++++++

  let runCounter = 1;

  for (let i = 0; i < userRuns.length - 1; i++){

    if(runCounter === 3){
      answers.threeInRow++;
      runCounter = 1;
    }

    const thisRun = userRuns[i];
    const nextRun = userRuns[i+1];
  
    const today = moment(thisRun.start).calendar();
    const tomorrow = moment(today).add(1, 'days').calendar();
    const nextDate = moment(nextRun.start).calendar();

    if(thisRun.distance > 1){
      if(tomorrow === nextDate){
        runCounter++;
      }
      else{ runCounter = 1;}
    }
  }
  if(runCounter === 3){
    answers.threeInRow++;
  }


  //===========  QUESTION 2 ==========================================================
  //++++++ Ran >10km in calendar week (M-F) +++++++++++++++++++++++++++++++++++++++++
  let tenInWeek = 0;
  let weeklyDistance = 0;
  let currentWeek = null;

  for(let i = 0; i < userRuns.length; i++){
   
    const thisRun = userRuns[i].start;
    const thisWeek = moment(thisRun).isoWeek();
    const thisDistance = userRuns[i].distance;

    if(currentWeek === null){
      currentWeek = thisWeek; 
    }

    if(thisWeek === currentWeek){
      weeklyDistance += thisDistance;
    }
    else{
      if(weeklyDistance > 10){
        tenInWeek++;
      }
      weeklyDistance = thisDistance;
      currentWeek = thisWeek;
    } 
  }
  answers.tenInWeek = tenInWeek;


  //============ OUESTION THREE ========================================================================
  // ++ Shortest stride length at what distance and Longest stride length at what distance ++++++++++

  const strideStats = userRuns
    .filter (run => (run.steps !== undefined) && (run.steps !== 0))
    .map( run => {
      return ({
        strides: run.steps, 
        'distance(km)': parseFloat((run.distance).toFixed(4)),
        'average stride(m)': parseFloat((run.distance*1000/run.steps).toFixed(2))
      });
    })
    .sort((a,b) => a['average stride(m)'] - b['average stride(m)']);

  answers.shortestStride = strideStats[0];
  answers.longestStride = strideStats[strideStats.length - 1];


  // returns the answers object as json
  return res.json(answers);
});


//============ PORT LISTENING ==============================

app.listen(8080, function () {
  console.log('App listening on port 8080');
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
// if type is distance
// if distance > 1
// count for if start day === previous start day + 1
// count for when consec start day === 3

// to answer second question, we need 
// to sort into weeks
// week runs M-F
// counter for each week, if sum of distance > 10

//to answer third question, we need to 

  