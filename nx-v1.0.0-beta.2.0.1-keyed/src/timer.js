'use strict'

let startTime
let lastMeasure

function startMeasure (name) {
  startTime = performance.now()
  lastMeasure = name
}

function stopMeasure () {
  let last = lastMeasure
  if (lastMeasure) {
    window.setTimeout(() => {
      lastMeasure = null
      let stop = performance.now()
      console.log(last + " took " + (stop - startTime))
    })
  }
}

module.exports = {
  startMeasure,
  stopMeasure
}
