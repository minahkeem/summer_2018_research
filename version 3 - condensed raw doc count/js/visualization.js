const left_margin = 10;
const line_w = 845;
const line_h = 2;

const rect_pos = {
    2007: left_margin,
    2008: left_margin+75,
    2009: left_margin+150,
    2010: left_margin+225,
    2011: left_margin+300,
    2012: left_margin+375,
    2013: left_margin+450,
    2014: left_margin+525,
    2015: left_margin+600,
    2016: left_margin+675,
    2017: left_margin+750
};

//returns array of all doc_count values
function findUnigramDocRange(data) {
    var arr = [];
    for(var i=0; i < data.length; i++) {
        var tot_count = data[i].total_count
        for(var j=0; j<tot_count.length; j++) {
            arr.push(tot_count[j].count)
        }
    }
    return d3.extent(arr)
}

function drawHeatMap(data) {
    var heat_map = d3.select("#heat_map");
    
    //column titles: year
    var cols = heat_map.append("svg")
        .attr("id", "years")
        .attr("width", line_w+left_margin)
        .attr("height", 20)
        .style("margin-top", 15)
        .style("margin-bottom", 5);
    var col_year = 2007;
    for(var i=0; i<11; i++) {
        cols.append("text")
            .attr("x", rect_pos[col_year]+20)
            .attr("y", 18)
            .text(col_year)
            .attr("fill", "black");
        col_year++;
    }
    
    var line = heat_map.selectAll("svg.lines")
        .data(data)
        .enter()
        .append("svg")
        .attr("width", line_w+left_margin)
        .attr("height", line_h);
    
    //create color range for the squares
    var valRange = findUnigramDocRange(data);
    var colors = ["#ffffff", "#003366"];
    var colorRange = d3.range(0,1,1);
    colorRange.push(1);
    var colorScale = d3.scaleLinear()
        .domain(colorRange)
        .range(colors)
        .interpolate(d3.interpolateRgb);
    var colorInterpolate = d3.scaleLinear()
        .domain(valRange)
        .range([0,1]);
    
    //append colored rectangles to each line
    line.selectAll("rect")
        .data((d) => {
            return d.total_count;
        })
        .enter()
        .append("rect")
        .attr("x", (d) => {
            return rect_pos[d.year];
        })
        .attr("y", 0)
        .attr("width", 75)
        .attr("height", line_h)
        .attr("fill", (d) => {
            return colorScale(colorInterpolate(d.count));
        })
}

function main() {
    d3.json("/vis_v1.json", (err, data) => {
        if(err) {
            console.log("Error loading JSON file");
        }
        else {
            console.log(data);
            drawHeatMap(data);
        }
    });
}

main();