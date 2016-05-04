var _ = require('lodash');
var dots = require('dot').process({
	path: './'
});
var fs = require('fs');

eval(fs.readFileSync('./chart.data.js', {
	encoding: 'utf8'
}));

var frameworks = [''];
_.forEach(data.datasets, function(dataset) {
	frameworks.push(dataset.label.replace('-v', ' v').replace('/dist', ''));
});


var benches = [];
_.forEach(data.labels, function(label, k) {
	var bench = {
		name: label,
		tests: []
	};
	
	var values = [];
	_.forEach(data.datasets, function(dataset) {
		values.push(_.round(parseFloat(dataset.data[k]), 2));
	});
	var sorted = values.slice(0).sort(function(a, b) {
		return a - b;
	});
	var min = sorted[1];
	var max = sorted[sorted.length - 1];
	
	var top1 = min * 1.33;
	var top3 = min * 2.33;
	
	while(top1 >= max) {
		top1 *= 0.8;
		top3 *= 0.8;
	}
	while(top3 >= max) {
		top3 *= 0.8;
	}
	
	_.forEach(values, function(value) {
		if(value <= top1) {
			bench.tests.push({
				value: value,
				class: 'top1'
			});
		}
		else if(value <= top3) {
			bench.tests.push({
				value: value,
				class: 'top3'
			});
		}
		else {
			bench.tests.push({
				value: value,
				class: 'top5'
			});
		}
	})
	
	/* var min = values.slice(0).sort(function(a, b) {
		return a - b;
	})[0];
	var avg = _.reduce(values, function(sum, n) {
		return sum + n;
	}, 0) / values.length;
	var d = (avg - min) / 3;
	
	var top1 = avg - d;
	var top3 = avg + d;
	console.log(avg, top1, top3);
	
	_.forEach(values, function(value) {
		if(value <= top1) {
			bench.tests.push({
				value: value,
				class: 'top1'
			});
		}
		else if(value <= top3) {
			bench.tests.push({
				value: value,
				class: 'top3'
			});
		}
		else {
			bench.tests.push({
				value: value,
				class: 'top5'
			});
		}
	}); */
	
	benches.push(bench);
});

fs.writeFileSync('./table.html', dots.table({
	frameworks: frameworks,
	benches: benches
}), {
	encoding: 'utf8'
})