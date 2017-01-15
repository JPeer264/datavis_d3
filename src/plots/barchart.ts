import $  = require('jquery');
import d3 = require('d3');

import { chartOptions } from '../assets/data/options';
import { generateColorArray } from './helper';

export class BarChart {
    public x;
    public y;
    public svg;
    public tooltip;
    public margin = {top: 20, right: 20, bottom: 30, left: 40};
    public _width:number  = 960; // - this.margin.left - this.margin.right;
    public _height:number = 500; //- this.margin.top  - this.margin.bottom;

    constructor(private options) {
        options.manager   = options.manager || {}
        options.selector  = options.selector || 'body',
        options.className = options.className || 'chart',

        this.addHeader("h1");

        this.svg = d3.select(options.selector)
           .append('div')
            .classed('svg-container', true)
            .classed('svg-container--barchart', true)
           .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 1000 800')
            .classed('svg-content-responsive', true)
           .append('g')
            // .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3.scaleBand()
            .range([0, this._width])
            .padding(0.1);

        this.y = d3.scaleLinear()
            .range([this._height, 0]);
    }

    public prepareStackedData(stackedLabel, stackedX, data = this.options.data.data) {
        const chooser = stackedX.key;
        const seperator = stackedLabel.key;
        const keyOptions = stackedLabel.options;
        const result: any = [];
        const seperatedData = {};

        let xRange = [];

        for (let d of data) {
            if (!seperatedData[d[seperator]]) {
                seperatedData[d[seperator]] = {};
            }

            if (!seperatedData[d[seperator]][d[chooser]]) {
                seperatedData[d[seperator]][d[chooser]] = 0
            }

            seperatedData[d[seperator]][d[chooser]] += 1;
        }


        for (let label in seperatedData) {
            let counter     = 0;
            let startPoint  = 0;
            let appendArray = [];

            // hardcoded... fill up missing keys
            seperatedData[label][1] = seperatedData[label][1] || 0;
            seperatedData[label][2] = seperatedData[label][2] || 0;
            seperatedData[label][3] = seperatedData[label][3] || 0;
            seperatedData[label][4] = seperatedData[label][4] || 0;
            seperatedData[label][5] = seperatedData[label][5] || 0;

            for (let key in seperatedData[label]) {
                let toAppend: any;
                let value: any = seperatedData[label][key];

                startPoint = 0;

                // -- stacking --
                // set the startPoint to
                // the previous highest point
                if (result.length > 0) {
                    startPoint = result[result.length - 1][counter][1];
                }

                toAppend      = [ startPoint, value + startPoint ];
                toAppend.data = {
                    filterData: {
                        [seperator]: label,
                        [chooser]: key
                    }
                }

                appendArray.push(toAppend)

                counter += 1;
            }

            xRange = Object.keys(seperatedData[label])


            result.push(appendArray);

            // append as required in D3.stack()
            result[result.length - 1].index = result.length - 1;
            result[result.length - 1].key = label;
        }

        result.data = {
            colorArray: generateColorArray(keyOptions, seperatedData),
            xRange
        };

        return result;
    }

    // @todo Get name of the heading
    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(this.options.selector).append(`<${tag}>${headerText}</${tag}>`);
    }

    public update(data = undefined): void {
        const self        = this;
        const stack       = d3.stack();
        const manager     = this.options.manager;
        const isTooltip   = false;
        const stackedData = this.prepareStackedData(this.options.stacked.label, this.options.stacked.x, data);

        let width  = this._width;
        let height = this._height;
        let x = this.x;
        let y = this.y;
        let z = d3.scaleOrdinal()
            .range(stackedData.data.colorArray);
        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Scale the range of the data in the domains
        // @todo get right z.domain
        x.domain(stackedData.data.xRange);
        y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);

        // https://bl.ocks.org/mbostock/3808234
        let barchart = this.svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
              .attr("fill", d => z(d.key))
            .selectAll("rect")
            .data(d => d);

        // Adds the legend
        // @todo Add the full name of the key
        let legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("x", 666 - 65)
            .attr("y", 25)
            .attr("height", 100)
            .attr("width", 100);

        legend.selectAll('g').data(stackedData)
            .enter()
            .append('g')
            .each(function(d, i) {
                let g = d3.select(this);
                g.append("rect")
                    .attr("x", width - 170)
                    .attr("y", 10 + i*40)
                    .attr("width", 30)
                    .attr("height", 30)
                    .style("fill", stackedData.data.colorArray[i]);

                g.append("text")
                    .attr("x", width - 130)
                    .attr("y", 24 + i*40 + 9)
                    .attr("height",30)
                    .attr("width",100)
                    .style("fill", stackedData.data.colorArray[i])
                    .text(stackedData[i]['key'])
                        .attr("font-size", "18pt");
            });

        // EXIT old elements not present in new data.
        barchart.exit()
            .attr('class', 'exit')
            .remove();

        // UPDATE old elements present in new data.
        barchart.attr('class', 'update')
            .attr("x", (d, i) => x(i + 1))
            .attr('width', x.bandwidth())
            .transition(300)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))

        barchart.enter().append("rect")
            .attr('class', 'interactive-rect')
            .attr("x", (d, i) => x(i + 1))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            // initialize event listeners
            .on('mouseover', d => {
                if (isTooltip) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html('test')
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                }
            })
            .on('mouseout', d => {
                if (isTooltip) {
                    tooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                }
            })
            .on('click', function (d, i) {
                const $this = $(this);

                if (self.options.interactive) {
                    if ($this.hasClass('rect-active')) {
                        $('.interactive-rect').removeClass('low-alpha rect-active');

                        manager.releaseFilter();
                        manager.updateCharts();
                        return;
                    }

                    manager.filterData(d.data.filterData);

                    manager.updateCharts();

                    $('.interactive-rect').removeClass('low-alpha rect-active');
                    $('.interactive-rect').addClass('low-alpha');
                    $this.removeClass('low-alpha');
                    $this.addClass('rect-active');
                }
            });
    }
}
