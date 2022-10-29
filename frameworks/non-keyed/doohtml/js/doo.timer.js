export default class Timer {
    static time = new Object()


    static start(name) {
		if (!Timer.time[name]) {
			Timer.time[name] = [ new Date().getTime()]    
		}    
	}
	static stop(name) {
        if (Timer.time[name]) {
            Timer.time[name].push(new Date().getTime())
            
    //		console.log(name, ': ', Timer.time[name][1] - Timer.time[name][0]);
            Timer.time[name].push(new Date().getTime())
            if (name==='clear') {
                document.title = 'c:' + (Timer.time[name][1] - Timer.time[name][0])  + ' |' + document.title
                Timer.time[name] = undefined
            }
            if (name==='build') {
                document.title = 'b:' + (Timer.time[name][1] - Timer.time[name][0])  + ' ' + document.title
                Timer.time[name] = undefined
            }
            if (name==='tot') {
                document.title = '**|t:' + (Timer.time[name][1] - Timer.time[name][0])  + ' ' + document.title
                Timer.time[name] = undefined
            }
            if (name==='add') {
                document.title = 'a:' + (Timer.time[name][1] - Timer.time[name][0])  + ' ' + document.title
                Timer.time[name] = undefined
            } 
        }
    }        
}