import d3 = require('d3');

export class PieChart {
    public svg;

    constructor(public data: Object, private options) {
        options = options || {};
        options.dataKey = options.dataKey || 'sex';
        options.keys = options.keys || {}
        options.selector = options.selector || 'body';
        options.width = 360;
        options.height = 360;

        this.svg = d3.select(this.options.selector)
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '-100 -100 600 600')
            .classed('svg-content-responsive', true)
            .append('g')
            .attr('transform', 'translate(' + (this.options.width / 2) +
                ',' + (this.options.height / 2) + ')');
    }

    public update(newData): void {
        const globalData = newData || this.data;
        const dataKey = this.options.dataKey;

        const tempData = {};
        const pieData = [];
        const colorArray = [];

        // split values from dattaKey
        for (let item in globalData) {
            if (!tempData[globalData[item][dataKey]]) {
                tempData[globalData[item][dataKey]] = 1;
            } else {
                tempData[globalData[item][dataKey]] += 1;
            }
        }

        for (let label in tempData) {
            const count = tempData[label];
            const keys = this.options.keys[label];

            if (!!keys) {
                colorArray.push(keys.color);
            } else {
                colorArray.push("#"+((1<<24)*Math.random()|0).toString(16));
            }

            if (label === 'undefined') {
                continue;
            }

            pieData.push({
                label,
                count
            });
        }

        const radius = Math.min(this.options.width, this.options.height) / 2;

        const arcTween = function (d, index) {
            var i = d3.interpolate(this._current, d);

            this._current = i(0);

            return t => arc(i(t), index);
        }

        const color = d3.scaleOrdinal(d3.schemeCategory20b)
            .range(colorArray);

        // responsive svg http://stackoverflow.com/a/25978286
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);

        const path = this.svg.selectAll('path')
            .data(pie(pieData))

        path.enter()
            .append('path')
            .attr('class', 'enter')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .transition()
            .duration(750)
            .attrTween('d', arcTween);

        path.exit()
            .attr('class', 'exit')
            .transition()
            .duration(750)
            .attrTween('d', arcTween)
            .remove();

        path.attr('class', 'update')
            .transition()
            .duration(750)
            .attrTween('d', arcTween);
    }
}
