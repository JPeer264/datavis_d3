import d3 = require('d3');

export class PieChart {
    constructor(public data: Object, public dataKey: String, public selector: string = 'body', public width: number = 360, public height: number = 360) {
    }

    public update(): void {
        // const data = [
        //     { label: 'Abulia', count: 10 },
        //     { label: 'Betelgeuse', count: 20 },
        //     { label: 'Cantaloupe', count: 30 },
        //     { label: 'Dijkstra', count: 10 }
        // ];

        const data = this.data;
        const dataKey = this.dataKey;

        const newData = {};

        for (let item in data) {
            console.log(data[item]);
        }

        // var radius = Math.min(this.width, this.height) / 2;

        // var color = d3.scaleOrdinal(d3.schemeCategory20b);

        // // responsive svg http://stackoverflow.com/a/25978286
        // var svg = d3.select(this.selector)
        //     .append('div')
        //     .classed('svg-container', true)
        //     .append('svg')
        //     .attr('preserveAspectRatio', 'xMinYMin meet')
        //     .attr('viewBox', '-100 -100 600 600')
        //     .classed('svg-content-responsive', true)
        //     .append('g')
        //     .attr('transform', 'translate(' + (this.width / 2) +
        //         ',' + (this.height / 2) + ')');

        // var arc = d3.arc()
        //     .innerRadius(0)
        //     .outerRadius(radius);

        // var pie = d3.pie()
        //     .value(function(d) { return d.count; })
        //     .sort(null);

        // var path = svg.selectAll('path')
        //     .data(pie(data))
        //     .enter()
        //     .append('path')
        //     .attr('d', arc)
        //     .attr('fill', function(d) {
        //         return color(d.data.label);
        //     });

        // path.exit().remove();
    }
}
