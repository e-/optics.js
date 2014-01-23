# optics.js

optics.js is an open source JavaScript library which implements OPTICS clustering algorithm for *browsers* and *node.js*. For more detailed information about OPTICS clustering algorithm , refer to the below paper.
> Ankerst, Mihael, et al. "OPTICS: ordering points to identify the clustering structure." ACM SIGMOD Record 28.2 (1999): 49-60.

## Usage
`optics(data, minPts, epsilon, getter, dist)` returns an array of class `Point`.
  
* `data`: An array of data to be clustered.
* `minPts`: Defined in the forementioned paper.
* `epsilon` Defined in the forementioned paper.
* `getter`: *Optional.* If `data` contains other data structures (e.g. Object) rather than vectors (an array of numbers), you should specify how to get a vector from each element of `data`. The default value is an identity function (e.g. `function(d){return d;}`) which means each element of `data` is used as a vector.
* `dist`: *Optional.* A distance function which computes the distance between two vectors. If not specified, the Euclidan distance function is used.

Class `Point` contains the result of OPTICS clustering for one element of `data`

* `point.datum`
* `point.isProcessed`
* `point.coreDistance`
* `point.reachability`
* `point.index`
   
 ## LICENSE
 
 &copy; 2014, Jaemin Jo. Released under BSD license.
