/*eslint indent:0, quotes:0, no-console:0*/
var startTime
var lastMeasure

module.exports = {
  start: function startMeasure(name) {
    startTime = performance.now()
    lastMeasure = name
  },
  stop: function stopMeasure() {
    var last = lastMeasure
    if (lastMeasure) {
      window.setTimeout(function () {
        lastMeasure = null
        var stop = performance.now()
        console.log(last+" took "+(stop-startTime))
      }, 0)
    }
  }
}
