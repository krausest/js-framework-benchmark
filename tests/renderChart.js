var div = document.getElementById("charts");
function createChart(data) {
    var canvas = document.createElement("canvas");
    div.appendChild(canvas);
    canvas.setAttribute("width", "1024");
    canvas.setAttribute("height", "400");
    var ctx = canvas.getContext("2d");
    var myChart = new Chart(ctx).Bar(data, {barStrokeWidth : 1,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        multiTooltipTemplate: "<%= datasetLabel %>: <%= value %>"
    });
    var legend = document.createElement("div");
    legend.setAttribute("class", "legend");
    div.appendChild(legend);
    legend.innerHTML = myChart.generateLegend();
}

createChart(data);
createChart(data_webdriver);