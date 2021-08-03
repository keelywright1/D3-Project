// d3.select('#scatter').style('border', '2px solid black');
var width = parseFloat(d3.select('#scatter').style('width'));
var height = .66 * width;
var svg = d3.select('#scatter').append('svg').style('width', width).style('height', height);

var xText = svg.append('g').attr('transform', `translate(${0.5 * width},${.97 * height})`);
var yText = svg.append('g').attr('transform', `translate(${0.03 * width},${.5 * height})rotate(-90)`);

xText.append('text').text('Household Income (Median)').attr('class', 'aText inactive x').attr('data-id', 'income');
xText.append('text').text('Age (Median)').attr('class', 'aText inactive x').attr('data-id', 'age').attr('y', -20);
xText.append('text').text('In Poverty (%)').attr('class', 'aText active x').attr('data-id', 'poverty').attr('y', -40);

yText.append('text').text('Obese (%)').attr('class', 'aText y active').attr('data-id', 'obesity');
yText.append('text').text('Smokes (%)').attr('class', 'aText y inactive').attr('data-id', 'smokes').attr('y', 20);
yText.append('text').text('Lacks Healthcare (%)').attr('class', 'aText y inactive').attr('data-id', 'healthcare').attr('y', 40);

var chart = svg.append('g').attr('transform',`translate(${.15*width},${.75*height})`)
var xScaleLoc = chart.append('g').transition().duration(2000);
var yScaleLoc = chart.append('g').transition().duration(2000);

renderData();
d3.selectAll('.aText').on('click', handleClick);

function handleClick() {
    // is this classed x?
    if (d3.select(this).classed('x')) {
        d3.selectAll('.x').classed('inactive', true).classed('active', false);
    } else {
        d3.selectAll('.y').classed('inactive', true).classed('active', false);
    }
    d3.select(this).classed('active', true).classed('inactive', false);

    renderData();
};

function renderData() {
    var x = d3.selectAll('.x').filter('.active').attr('data-id');
    var y = d3.selectAll('.y').filter('.active').attr('data-id');
    
    d3.csv('assets/data/data.csv').then(data=>{
        
        var xData = data.map(d => +d[x]);
        var yData = data.map(d => +d[y]);

        var xScaler = d3.scaleLinear().range([0,.8*width]).domain([.9*d3.min(xData), 1.02 * d3.max(xData)]);
        var yScaler = d3.scaleLinear().range([0, -.65*height]).domain([.9*d3.min(yData), 1.02 * d3.max(yData)]);
        
        xScaleLoc.call(d3.axisBottom(xScaler));
        yScaleLoc.call(d3.axisLeft(yScaler))

        var circles = chart.selectAll('g').data(data).enter().append('g').on('mouseover', function (d) {
            toolTip.show(d,this);
            d3.select(this).style('stroke','#e3e3e3');
        }).on('mouseout', function (d) {
            toolTip.hide(d);
            d3.select(this).style('stroke','#323232');
        });

        circles.append('circle').attr('r',.02*width).attr('class','stateCircle');
        circles.append('text').attr('class','stateText');

        showCircles();

        function showCircles() {
            d3.selectAll('.stateCircle').transition().duration(1000).attr('cx', d => xScaler(d[x])).attr('cy', d => yScaler(d[y]));

            d3.selectAll('.stateText').transition().duration(1000).attr('dx', d=> xScaler(d[x])).attr('dy',d=>yScaler(d[y]-.4)).text(d=>d.abbr);
        }


   }) 
};
