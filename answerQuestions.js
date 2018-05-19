'use strict';

const moment = require('moment');
const activities = require('./activities');

// this function will be returning the information about a given user
// i'm assuming we're going to pass in valid userId

const answerQuestions = (userId) => {

  // answers will store the answers to all the questions for ease of returning
  const answers = {
    user: userId,
    threeInRow: 0,
    tenInWeek: 0,
    shortestStride: null,
    longestStride: null
  };

  //filter the activities data for a match to the user_id coming in
  //sort in chronological order based on start time of activity
  //currently using a library - moment - for easy date manipulation and comparison 

  const userRuns = activities
    .filter(user => (user.user_id === userId) && (user.type === 'run'))
    .sort((a, b) => moment(a.start) - moment(b.start));


  //===== QUESTION 1: =============================================
  //+++++ Return how many times ran > 1km three days in a row ++++++++

  let runCounter = 1;

  for (let i = 0; i < userRuns.length - 1; i++) {

    if (runCounter === 3) {
      answers.threeInRow++;
      runCounter = 1;
    }

    const thisRun = userRuns[i];
    const nextRun = userRuns[i + 1];

    const tomorrow = moment(thisRun.start).add(1, 'days').calendar();
    const nextDate = moment(nextRun.start).calendar();

    if (thisRun.distance > 1) {
      if (tomorrow === nextDate) {
        runCounter++;
      }
      else { runCounter = 1; }
    }
  }
  if (runCounter === 3) {
    answers.threeInRow++;
  }


  //===========  QUESTION 2 ==========================================================
  //++++++ Ran >10km in calendar week (M-F) +++++++++++++++++++++++++++++++++++++++++
  let tenInWeek = 0;
  let weeklyDistance = 0;
  let currentWeek = null;

  for (let i = 0; i < userRuns.length; i++) {

    const thisRun = userRuns[i].start;
    const thisWeek = moment(thisRun).isoWeek();
    const thisDistance = userRuns[i].distance;

    // since the entries are already sorted by start time, 
    // I'm assuming that the weeks will be in ascending order,
    // and there will be no conflict with repeated week numbers that have wrapped to the next year

    if (currentWeek === null) {
      currentWeek = thisWeek;
    }

    if (thisWeek === currentWeek) {
      weeklyDistance += thisDistance;
    }
    else {
      if (weeklyDistance > 10) {
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
    .filter(run => (run.steps !== undefined) && (run.steps !== 0))
    .map(run => {
      return ({
        strides: run.steps,
        'distance(km)': parseFloat((run.distance).toFixed(4)),
        'average stride(m)': parseFloat((run.distance * 1000 / run.steps).toFixed(2))
      });
    })
    .sort((a, b) => a['average stride(m)'] - b['average stride(m)']);

  answers.shortestStride = strideStats[0];
  answers.longestStride = strideStats[strideStats.length - 1];


  // returns the answers object as json
  return JSON.stringify(answers, null, 4);
};


module.exports = answerQuestions;