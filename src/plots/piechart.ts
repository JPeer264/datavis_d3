import d3 = require('d3');

export class PieChart {

    constructor(public selector: string = 'body', public width: number = 360, public height: number = 360) {
        const data =    [{"label":"one", "value":20},
                        {"label":"two", "value":50},
                        {"label":"three", "value":30}];

        this.update(data);
    }

    public update(data: Array<Object>): void {

        var dataset = [
            { label: 'Abulia', count: 10 },
            { label: 'Betelgeuse', count: 20 },
            { label: 'Cantaloupe', count: 30 },
            { label: 'Dijkstra', count: 40 }
        ];

        var radius = Math.min(this.width, this.height) / 2;

        var color = d3.scaleOrdinal(d3.schemeCategory20b);

        var svg = d3.select('.piechart')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', 'translate(' + (this.width / 2) +
                ',' + (this.height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d) {
                return color(d.data.label);
            });

        path.exit().remove();
    }
}
