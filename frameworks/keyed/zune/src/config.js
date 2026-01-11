export default {
	duration: false, 
	init: {
		type: "ready",
		preloader: null
	},
	events: {
		click: true
	},
	api: {
		url: "/",
		method: "POST",
		headers: false,
		format: "json"
	},
	spa: false,
	cache: {
		component: 50,
		module: 50,
		api: 50,
		state: 5
	},
	cacheTime: 300
}