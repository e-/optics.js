(function(){
  'use strict';

  function euclidean(a, b, n){
    if(!n) n = 2;
    if(a.length !== b.length) {
      console.log(a,b);
      throw new Error('vector dimensions must agree');
    }
    var i, sum=0;
    for(i=a.length-1;i>=0;--i) {
      sum += Math.pow(a[i] - b[i], n);
    }
    return Math.pow(sum, 1 / n);
  }
  

  function Heap(){
    this.heap = [];
    this.size = 0;
  }

  Heap.prototype = {
    swap: function(i1, i2){
      var temp;
      temp = this.heap[i1]; this.heap[i1] = this.heap[i2]; this.heap[i2] = temp;
    },
    insert: function(d){
      this.heap[this.size] = d;
      this.size++;
      this.bubbleUp(this.size - 1);
    },
    isEmpty: function(){
      return this.size == 0;
    },
    bubbleUp: function(index){
      if(!index) return;

      var parentIndex = Math.floor(index / 2);
      if(this.heap[parentIndex].reachability >= this.heap[index].reachability) {
        this.swap(parentIndex, index);
        this.bubbleUp(parentIndex);
      }
    },
    get: function(){
      var result = this.heap[0];
      this.heap[0] = this.heap[this.size - 1];
      this.heap[this.size - 1] = null;
      this.size--;
      this.bubbleDown(0);
      return result;
    },
    bubbleDown: function(index){
      var 
          left = this.heap[index * 2], 
          right = this.heap[index * 2 + 1],
          better,
          betterIndex;

      if(!left && !right) return;

      better = left;
      betterIndex = index * 2;

      if(right && better.reachability > right.reachability) {
        better = right;
        betterIndex = index * 2 + 1;
      }

      if(better.reachability < this.heap[index].reachability) {
        this.swap(betterIndex, index);
        this.bubbleDown(betterIndex);
      }
    },
    update: function(d){
      for(var i=0; i<this.size; ++i)
        if(this.heap[i] === d) {
          this.bubbleUp(i);
          break;
        }
    }
  };

  function Point(index, datum, vector, epsilon){
    this.datum = datum;
    this.vector = vector;
    this.isProcessed = false;
    this.coreDistance = null;
    this.reachability = -1;
    this.index = index;
  }

  function optics(data, minPts, epsilon, getter, dist){
    if(!getter) {
      getter = function(d){return d;}
    }
    if(!dist) {
      dist = euclidean;
    }
    
    var 
        dists = {},
        result = [],
        points = []
    ;
 
    data.forEach(function(d, index){
      points.push(new Point(index, d, getter(d), epsilon));
    });

    points.forEach(function(point1, index1){
      points.forEach(function(point2, index2){
        var d = dist(point1.vector, point2.vector);
        if(!dists[index1])
          dists[index1] = {};
        dists[index1][index2] = d;
      });
    });
    
    function getNeighbors(centerPoint){
      var neighbors = [];
      points.forEach(function(point){
        if(dists[centerPoint.index][point.index] < epsilon && !point.isProcessed)
          neighbors.push(point);
      });
      return neighbors.sort(function(a, b){return dists[centerPoint.index][a.index] - dists[centerPoint.index][b.index];});
    }

    function setCoreDistance(point, neighbors){
      if(neighbors.length <= minPts - 1)
        point.coreDistance = null;
      else 
        point.coreDistance = dists[point.index][neighbors[minPts - 1].index];
    }

    points.forEach(function(centerPoint){
      if(centerPoint.isProcessed) return;

      centerPoint.isProcessed = true;
      centerPoint.reachability = epsilon + 1;

      var 
          neighbors = getNeighbors(centerPoint),
          heap = new Heap()
      ;

      function update(neighbors, centerPoint){
        var coreDistance = centerPoint.coreDistance;
        neighbors.forEach(function(point){
          var r = Math.max(coreDistance, dists[centerPoint.index][point.index]);
          if(point.reachability < 0) {
            point.reachability = r;
            heap.insert(point);
          } else if(point.reachability > r){
            point.reachability = r;
            heap.update(point);
          }
        });
      }

      setCoreDistance(centerPoint, neighbors);
      result.push(centerPoint);
      if(centerPoint.coreDistance) {
        update(neighbors, centerPoint);
        
        while(!heap.isEmpty()) {
          var current = heap.get();
          current.isProcessed = true;
          neighbors = getNeighbors(current);
          setCoreDistance(current, neighbors);
          result.push(current);
          if(current.coreDistance)
            update(neighbors, current);
        }
      }
    });

    return result;
  }

  if (typeof define == 'function' && define.amd) {
    define(function(){
      return optics;
    });
  } else if (typeof module !== 'undefined') {
    module.exports = optics;
  } else {
    window.optics = optics;
  }
})();
