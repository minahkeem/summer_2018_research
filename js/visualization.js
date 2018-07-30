const left_margin = 200;
const line_w = 1050-left_margin;
const line_h = 25;

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

//create and label each line (unigram) of heatmap
function drawUnigramLines(data) {
    var heat_map = d3.select("#heat_map");
    
    //column titles: year
    var cols = heat_map.append("svg")
        .attr("id", "years")
        .attr("width", line_w+left_margin)
        .attr("height", line_h);
    var col_year = 2007;
    for(var i=0; i<11; i++) {
        cols.append("text")
            .attr("x", rect_pos[col_year]+20)
            .attr("y", 20)
            .text(col_year)
            .attr("fill", "black");
        col_year++;
    }
        
    var line = heat_map.selectAll("svg")
        .data(data)
        .enter()
        .append("svg")
        .attr("width", line_w+left_margin)
        .attr("height", line_h)
        .attr("id", (d,i) => {
            return i;
        });
    
    //append keywords at the beginning of each row
    line.append("text")
        .attr("text-anchor", "end")
        .attr("x", left_margin-10)
        .attr("y", 20)
        .text((d) => {
            return d.word;
        })
    
    //create color range for the squares
    var valRange = findUnigramDocRange(data)
    var colors = ["#ffffff", "#003366"];
    var colorRange = d3.range(0,1,1);
    colorRange.push(1);
    var colorScale = d3.scaleLinear()
        .domain(colorRange)
        .range(colors)
        .interpolate(d3.interpolateHcl);
    var colorInterpolate = d3.scaleLinear()
        .domain(valRange)
        .range([0,1]);
    //create and display color legend on page
    var legend = d3.select("#legend")
        .append("svg")
        .attr("width", 50)
        .attr("height", 500);
    var defs = legend.append("defs");
    var gradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#003366");
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#ffffff");
    gradient.attr("width", 40)
        .attr("height", 450);
    legend.append("rect")
        .attr("width", 20)
        .attr("height", 400)
        .attr("x", 0)
        .attr("y", 20)
        .style("fill", "url(#linear-gradient)");
    legend.append("text")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("x", 25)
        .attr("y", 20)
        .text(valRange[1]);
    legend.append("text")
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "baseline")
        .attr("x", 25)
        .attr("y", 420)
        .text(valRange[0]);
    /*for each unigram line:
        -set margin for word|heat map squares
        -write in the word on the left side
         for each year in total_counts:
            -draw a square with color gradient*/
}

function main() {
    d3.json("/final.json", (err, data) => {
        if(err) {
            console.log("Error loading JSON file");
        }
        else {
            console.log(data);
            drawUnigramLines(data);
        }
    });
}

main();