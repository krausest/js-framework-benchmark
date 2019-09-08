const { performance, setTimeout } = window;

let startTime;
let lastMeasure;

export function startMeasure(name) {

    startTime = performance.now();
    lastMeasure = name;
}

export function stopMeasure() {

    const last = lastMeasure;

    if(lastMeasure){

        setTimeout(function(){

            lastMeasure = null;

            console.log(last + " took " + (performance.now() - startTime));

        }, 0);
    }
}