let startTime
let lastMeasure

export function startMeasure (name) {
  startTime = performance.now()
  lastMeasure = name
}

export function stopMeasure () {
  let last = lastMeasure
  if (lastMeasure) {
    window.setTimeout(() => {
      lastMeasure = null
      let stop = performance.now()
      console.log(last + " took " + (stop - startTime))
    })
  }
}
