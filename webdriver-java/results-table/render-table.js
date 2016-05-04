var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var files = fs.readdirSync("./results")
    .filter(file => file.endsWith('.txt'));

let results = new Map();
let frameworks = [];

files.map(f => {return {name: f, data: fs.readFileSync("./results/"+f, {encoding:"utf-8"})};})
    //.map(str => JSON.parse(str);});
    .forEach(({name, data}) => {
        let n = name.substring(0,name.length-4);
        results.set(n, Function("return "+data)());
        frameworks.push(n);
    });

console.log(frameworks);
let benchmarks = results.values().next().value.results.map(r => r.benchmark);
console.log(benchmarks);

let getValue = (framework, benchmark) =>results.get(framework).results.find(r => r.benchmark === benchmark).avg;

var fastest = new Map();
benchmarks.forEach(b => {
    fastest.set(b, frameworks.map(f => getValue(f,b)).reduce((a,b) => Math.min(a,b)));
});
console.log(fastest);

// console.log(results.get('preact-v2.8.3').results.find(r => r.benchmark==='create 1000 rows').avg);
// console.log(getValue('preact-v2.8.3', 'create 1000 rows'));

let factors = new Map();

let str = "<html><body><table>";
str += "<tr><th></th>"
frameworks.forEach(f =>
    { str += '<th>'+f+'</th>' }
);
str += "</tr>\n"
benchmarks.forEach(b =>
{
    str += "<tr><th>"+b+"</th>";
    frameworks.forEach(f =>
        {
            let factor = (getValue(f,b)/fastest.get(b));
            factors.set(f, (factors.get(f) || 1.0)*factor);
            str += "<td>"+getValue(f,b)+"("
            +factor.toPrecision(3)+
            ")</td>";
        }
    );
    str += "</tr>\n"
}
);
str += "<th>Geom Avg</th>";
frameworks.forEach(f =>
    { str += '<th>'+Math.pow(factors.get(f), 1/benchmarks.length).toPrecision(3)+'</th>' }
);
str += "</table></body></html>";
fs.writeFileSync("results-table.html",str, {encoding:"utf-8"});