import d3 = require('d3');

export class BarChart {
    public x;
    public y;
    public svg;
    public margin = {top: 20, right: 20, bottom: 30, left: 40};
    public _width:number  = 960 - this.margin.left - this.margin.right;
    public _height:number = 500 - this.margin.top  - this.margin.bottom;

    constructor(public selector: string = 'body') {
        this.svg = d3.select(this.selector).append('svg')
            .attr('width', this._width + this.margin.left + this.margin.right)
            .attr('height', this._height + this.margin.top + this.margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3.scaleBand()
            .range([0, this._width])
            .padding(0.1);
        this.y = d3.scaleLinear()
            .range([this._height, 0]);
    }

    public update(barinfo): void {
        let x = this.x;
        let y = this.y;
        let width = this._width;
        let height = this._height;

        const data = barinfo.data;
        const newData = {};
        const dataArray = [];

        // sort them by x coordinate
        for (let d of data) {
            try {
                newData[d.x].push(d.y);
            } catch (e) {
                newData[d.x] = [ d.y ];
            }
        }

        // calculate the mean for every x coordinate and save into new array
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
        this.svg.selectAll('.bar')
            .data(dataArray)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.x) )
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.y) )
            .attr('height', d => height - y(d.y) );

        // add the x Axis
        this.svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        // add the y Axis
        this.svg.append('g')
            .call(d3.axisLeft(y));

        return this.svg;
    }
}
