var startTime;
var lastMeasure;
export const startMeasure = function(name) {
  startTime = performance.now();
  lastMeasure = name;
};
export const stopMeasure = function() {
  var last = lastMeasure;
  if (lastMeasure) {
    window.setTimeout(function() {
      lastMeasure = null;
      var stop = performance.now();
      console.log(last + " took " + (stop - startTime));
    }, 0);
  }
};
