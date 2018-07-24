var line_w = 1100;
var line_h = 25;

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
    var heat_map = d3.select("body").select("#heat_map");
    var line = heat_map.selectAll("svg")
        .data(data)
        .enter()
        .append("svg")
        .attr("class", "uni_line")
        .attr("width", line_w)
        .attr("height", line_h)
        .attr("id", (d,i) => {
            return i;
        });
    
    for(var i=0; i<data.length; i++) {
        var keyword = data[i].word;
    }
    
    /*for each unigram line:
        -set margin for word|heat map squares
        -write in the word on the left side
         for each year in total_counts:
            -draw a square with color gradient*/
    
    var range = findUnigramDocRange(data)
    console.log(range)
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