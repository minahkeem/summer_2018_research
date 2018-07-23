const margin = { top: 20, right: 20, bottom: 20, left: 20},
      width = 1000-margin.right-margin.left,
      height = 1000-margin.top-margin.bottom;

function drawRects(data) {
    var svg = d3.select("body").append("svg");
    
    
}

function main() {
    d3.json("/final.json", (err, data) => {
        if(err) {
            console.log("Error loading JSON file");
        }
        else {
            console.log(data);
            
            drawRects(data);
        }
    });
}

main();