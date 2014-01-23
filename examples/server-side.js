#!/usr/bin/env node
'use strict';

var 
    fs = require('fs'),
    optics = require('../optics')
;

fs.readFile('data.json', function(err, raw){
  var
      data = JSON.parse(raw.toString()),
      minPts = 4,
      epsilon = 100;

  optics(data, minPts, epsilon).forEach(function(point){
    console.log(point.index, point.reachability);
  });
});

