import $  = require('jquery');
import d3 = require('d3');

import { chartOptions } from '../assets/data/options';
import { generateColorArray, createTooltip } from './helper';

export class PieChart {
    private svg;
    private tooltip;

    constructor(private data: Object, private options) {
        options = options || {};
        options.keys = options.keys || {}
        options.width = 360;
        options.height = 360;
        options.selector = options.selector || 'body';

        this.addHeader('h3', this.options.name);

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

        this.tooltip = createTooltip();
    }

      //////////////////
     // == PUBLIC == //
    //////////////////
    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(this.options.selector).append(`<${tag}>${headerText}</${tag}>`);
    }

    public prepareData(data): Array<Object> {
        const pieData = [];
        const seperator = this.options.key;
        const seperatedData = {};

        // split values from dataKey
        for (let d in data) {
            if (!seperatedData[data[d][seperator]]) {
                seperatedData[data[d][seperator]] = 1;
            } else {
                seperatedData[data[d][seperator]] += 1;
            }
        }

        for (let label of this.options.options) {
            const count = seperatedData[label];

            pieData.push({
                label,
                count
            });
        }

        return pieData;
    }

    public update(data = this.data): void {
        const pieData = this.prepareData(data);

          // =============== //
         // == FUNCTIONS == //
        // =============== //
        this.addLegend(pieData);
        this.addChart(pieData);
    }

      ///////////////////
     // == PRIVATE == //
    ///////////////////
    private addChart(data) {
        const self = this;
        const radius = Math.min(this.options.width, this.options.height) / 2;
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        const pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);
        const path = this.svg.selectAll('path')
            .data(pie(data));

        const arcTween = function (d, index) {
            const i = d3.interpolate(this._current, d);

            this._current = i(0);

            return t => arc(i(t), index);
        };

        path.enter()
            .append('path')
            .on('mouseover', () => {
                this.tooltip.classed('hidden', false);
            })
            .on('mouseout', () => {
                this.tooltip.classed('hidden', true);
            })
            .on('mousemove', function (d) {
                const xPosition = d3.mouse($('body')[0])[0] - 20 - ($('.tooltip').width() / 2);
                const yPosition = d3.mouse($('body')[0])[1] - 40 - $(window).scrollTop() - ($('.tooltip').height() / 2);

                let text = `${chartOptions[d.data.label].name}: <b>${d.data.count} People</b>`;
                console.log(d)

                self.tooltip.style('transform', `translate(${xPosition}px, ${yPosition}px)`);
                self.tooltip.html(text)
            })
            .attr('class', 'enter')
            .attr('class', 'path')
            .attr('d', arc)
            .attr('fill', d => chartOptions[d.data.label].color)
            .transition()
            .duration(750)
            .attrTween('d', arcTween)

        path.attr('class', 'update')
            .attr('fill', d => chartOptions[d.data.label].color)
            .transition()
            .duration(750)
            .attrTween('d', arcTween);

        path.exit()
            .attr('class', 'exit')
            .transition()
            .duration(750)
            .attrTween('d', arcTween)
            .remove();
    }

    private addLegend(data) {
        // @todo Add the full name of the key
        const legend = this.svg
            .selectAll('g').data(data);

        const legendEnter = legend.enter()
            .append('g')
            .attr('class', 'legend')
            .attr('x', 0)
            .attr('y', 250)
            .attr('height', 100)
            .attr('width', 100)
            .each(function (d, i) {
                let g = d3.select(this);
                let label = data[i]['label'];
                let name = chartOptions[label].name;

                g.append('rect')
                    .attr('x', - 100)
                    .attr('y', 210 + i * 50)
                    .attr('width', 34)
                    .attr('height', 34)
                    .style('fill', d => chartOptions[d.label].color);

                g.append('text')
                    .attr('x', - 50)
                    .attr('y', 240 + i * 50)
                    .attr('height', 30)
                    .attr('width', 100)
                    .style('fill', d => chartOptions[d.label].color)
                    .text(name)
                        .attr('font-size', '24pt');
            });

        legend.exit().remove()
    }
}
