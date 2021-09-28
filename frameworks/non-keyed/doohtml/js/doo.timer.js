export default class Timer {
    static time = new Object()


    static start(name) {
	
		if (!Timer.time[name]) {
			Timer.time[name] = [ new Date().getTime()]    
		}    
	};
	static stop(name) {
		if (Timer.time[name]) {
			Timer.time[name].push(new Date().getTime())
		//	console.log(name, ': ', Timer.time[name][1] - Timer.time[name][0]);
			if (name==='tot') document.title = (Timer.time[name][1] - Timer.time[name][0])  + '|' + document.title
			Timer.time[name] = undefined
		}
	};
}