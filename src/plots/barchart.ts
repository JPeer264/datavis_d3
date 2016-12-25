import d3 = require('d3');

export class BarChart {
    // set the dimensions and margins of the graph

    // set the ranges

    constructor(public selector: string = 'body', public bar_height: number = 50) {}

    public update(barinfo): void {
        let margin = {top: 20, right: 20, bottom: 30, left: 40};
        let _width:number = 960 - margin.left - margin.right;
        let _height:number = 500 - margin.top - margin.bottom;
        let x = d3.scaleBand()
            .range([0, _width])
            .padding(0.1);
        let y = d3.scaleLinear()
            .range([_height, 0]);
        let svg = d3.select(this.selector).append("svg")
            .attr("width", _width + margin.left + margin.right)
            .attr("height", _height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = barinfo.data;
        const newData = {};
        const dataArray = [];

        for (let d of data) {
            try {
                newData[d.x].push(d.y);
            } catch (e) {
                newData[d.x] = [ d.y ];
            }
        }

        for (let d in newData) {
            dataArray.push({
                x: d,
                y: d3.mean(newData[d])
            })
        }

        // Scale the range of the data in the domains
        x.domain([1, 2, 3, 4, 5]);
        y.domain([0, d3.max(data, d => d.y)]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(dataArray)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { console.log(d); return y(d.y); })
            .attr("height", function(d) { console.log(y(d.y)); return _height - y(d.y); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + _height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // rect.exit().remove();
    }
}
