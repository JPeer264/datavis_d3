import $  = require('jquery');
import d3 = require('d3');

import { chartOptions } from '../assets/data/options';
import { generateColorArray } from './helper';

export class PieChart {
    public svg;
    public legend;

    constructor(public data: Object, private options) {
        options = options || {};
        options.keys = options.keys || {}
        options.width = 360;
        options.height = 360;
        options.selector = options.selector || 'body';

        this.addHeader("h3", this.options.name);

        this.svg = d3.select(this.options.selector)
            .append('div')
            .classed('svg-container', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '-65 0 500 500')
            .classed('svg-content-responsive', true)
            .append('g')
            .attr('transform', 'translate(' + (this.options.width / 2) +
                ',' + (this.options.height / 2) + ')');

        this.legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("x", 0)
            .attr("y", 250)
            .attr("height", 100)
            .attr("width", 100);
    }

    // @todo Get name of the heading
    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(this.options.selector).append(`<${tag}>${headerText}</${tag}>`);
    }

    public update(data = this.data): void {
        const radius = Math.min(this.options.width, this.options.height) / 2;
        const seperator = this.options.key;

        const pieData = [];
        const keyOptions = this.options.options;
        const seperatedData = {};

        const arcTween = function (d, index) {
            var i = d3.interpolate(this._current, d);

            this._current = i(0);

            return t => arc(i(t), index);
        }

        // split values from dattaKey
        for (let d in data) {
            if (!seperatedData[data[d][seperator]]) {
                seperatedData[data[d][seperator]] = 1;
            } else {
                seperatedData[data[d][seperator]] += 1;
            }
        }

        for (let label in seperatedData) {
            const count = seperatedData[label];

            if (label === 'undefined') {
                continue;
            }

            pieData.push({
                label,
                count
            });
        }

          // ================ //
         // == add charts == //
        // ================ //
        const colorArray = generateColorArray(keyOptions, Object.keys(seperatedData));
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
            .data(pie(pieData));

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

        // Adds the legend
        // @todo Add the full name of the key
        this.legend.selectAll('g').data(pieData)
            .enter()
            .append('g')
            .each(function (d, i) {
                let g = d3.select(this);
                let fillColor = colorArray[i];
                let label = pieData[i]['label'];
                let name = chartOptions[label].name;

                g.append("rect")
                    .attr("x", -100)
                    .attr("y", 210 + i*50)
                    .attr("width", 34)
                    .attr("height", 34)
                    .style("fill", fillColor);

                g.append("text")
                    .attr("x", -50)
                    .attr("y", 240 + i*50)
                    .attr("height",30)
                    .attr("width",100)
                    .style("fill", fillColor)
                    .text(name)
                        .attr("font-size", "24pt");
            });
    }
}
