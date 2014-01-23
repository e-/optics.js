#!/usr/bin/env node
'use strict';

function normal(mean, deviation) {
  return function(){
    var r1, r2, r;

    do {
      r1 = 2 * Math.random() - 1;
      r2 = 2 * Math.random() - 1;
      r = r1 * r1 + r2 * r2;
    } while(r >= 1|| r == 0);

    return mean + deviation * r1 * Math.sqrt(-2 * Math.log(r) / r);
  };
}

function shuffle(o){ /* http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript */
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

var 
    n = 3,
    dim = 2,
    means = [[30, 50], [70, 20], [90, 90]],
    deviations = [[5, 10], [10, 7], [15, 12]],
    ns = [35, 40, 30],
    outlier = 30,
    result = []
    ;

for(var i=0; i<n; ++i) {
  var normals = [];
  for(var d=0; d<dim; ++d) {
    normals.push(normal(means[i][d], deviations[i][d]));
  }
  for(var c=ns[i]; c>0; --c){
    var row = [];
    for(var d=0; d<dim; ++d) {
      row.push(normals[d]());
    }
    result.push(row);
  }
}

for(var i=0; i<outlier; ++i){
  result.push([Math.random() * 110, Math.random() * 110]);
}

result = shuffle(result);

console.log(result);
