import $  = require('jquery');
import d3 = require('d3');

import { jsonData, chartOptions } from '../assets/data/options';
import { generateColorArray, getStackedNames, createTooltip } from './helper';

export class BarChart {
    public x;
    public y;
    public svg;
    public tooltip;
    public margin = {top: 20, right: 20, bottom: 30, left: 40};
    public _width:number  = 800; // - this.margin.left - this.margin.right;
    public _height:number = 440; //- this.margin.top  - this.margin.bottom;
    public legend;

    constructor(private options) {
        options.manager   = options.manager || {};
        options.selector  = options.selector || 'body';
        options.className = options.className || 'chart';

        this.addHeader("h1", getStackedNames(this.options.stacked));

        this.svg = d3.select(options.selector)
           .append('div')
            .classed('svg-container', true)
            .classed('svg-container--barchart', true)
           .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 1050 550')
            .classed('svg-content-responsive', true)
           .append('g');
            // .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3.scaleBand()
            .range([0, this._width])
            .padding(0.1);

        this.y = d3.scaleLinear()
            .range([this._height, 0]);

        this.legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('x', 666 - 65)
            .attr('y', 25)
            .attr('height', 100)
            .attr('width', 100);

        let x = d3.scaleLinear()
            .domain([1, 5])
            .range([100, this._width - 100]);

        this.svg.append("g")
            .attr("transform", "translate(0," + (this._height + 10) + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x)
                .ticks(5))
                .attr('font-size', '18pt');

/*        this.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(this.y))
            .attr("transform", "translate(20," + 0 + ")");*/

        this.tooltip = createTooltip();
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

        for (let label of this.options.stacked.label.options) {
            let counter     = 0;
            let startPoint  = 0;
            let appendArray = [];

            if (!seperatedData[label]) {
                seperatedData[label] = {};
            }

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

                appendArray.push(toAppend);

                counter += 1;
            }

            xRange = Object.keys(seperatedData[label]);

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
        // let tooltip = d3.select('body').append('div')
        //     .attr('class', 'tooltip')
        //     .style('opacity', 0);

        // Scale the range of the data in the domains
        // @todo get right z.domain
        x.domain(stackedData.data.xRange);
        y.domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]);

        // Adds the legend
        this.legend.selectAll('g').data(stackedData)
            .enter()
            .append('g')
            .each(function(d, i) {
                let g = d3.select(this);

                g.append('rect')
                    .attr('x', width + 20)
                    .attr('y', (height/2 - 30) + i * 40)
                    .attr('width', 24)
                    .attr('height', 24)
                    .style('fill', d => chartOptions[d.key].color);

                g.append('text')
                    .attr('x', width + 54)
                    .attr('y', (height/2 - 10) + i * 40)
                    .attr('height',30)
                    .attr('width',100)
                    .style('fill', '#333')
                    .text(chartOptions[d.key].name)
                        .attr('font-size', '16pt');
            });

        const categories = this.svg.selectAll('.category')
            .data(stackedData)

        const categoriesEntered = categories.enter()
            .append('g')
            .attr('class', 'category');

        const categoriesUpdated = categories.merge(categoriesEntered)
            .attr('fill', d => chartOptions[d.key].color);

        categories.exit().remove();

        const rects = categoriesUpdated.selectAll('rect')
            .data(d => d);

        const rectsEntered = rects.enter()
            .append('rect')
            .attr('class', (d, i) => {
                return `rect interactive-rect-${Object.keys(d.data.filterData).join('-')}`
            })
            .attr('x', (d, i) => x(i + 1))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth())
            // initialize event listeners
            .on('mouseover', () => {
                this.tooltip.classed('hidden', false);
            })
            .on('mouseout', () => {
                this.tooltip.classed('hidden', true);
            })
            .on('mousemove', d => {
                const xPosition = d3.mouse($('body')[0])[0] - 20 - ($('.tooltip').width() / 2);
                const yPosition = d3.mouse($('body')[0])[1] - 80 - $(window).scrollTop() - ($('.tooltip').height() / 2);

                let text = '';
                let amount = d[1] - d[0];

                for (let key in d.data.filterData) {
                    let value = d.data.filterData[key];
                    let textValue = value;

                    if (chartOptions[value] && chartOptions[value].name) {
                        textValue = chartOptions[value].name;
                    }

                    text += `${jsonData[key].name}: <b>${textValue}</b><br>`;
                }

                self.tooltip.style('transform', `translate(${xPosition}px, ${yPosition}px)`);
                self.tooltip.html(`<strong>${amount} People</strong><br>${text}`);
            })
            .on('click', function (d, i) {
                const $this = $(this);
                const className = `.interactive-rect-${Object.keys(d.data.filterData).join('-')}`;

                if (self.options.interactive) {
                    if ($this.hasClass('rect-active')) {
                        $(className).removeClass('low-alpha rect-active');

                        manager.releaseFilter();
                        manager.updateCharts();

                        return;
                    }

                    manager.filterData(d.data.filterData);
                    manager.updateCharts();

                    $(className).removeClass('low-alpha rect-active');
                    $(className).addClass('low-alpha');
                    $this.removeClass('low-alpha');
                    $this.addClass('rect-active');
                }
            });

        const rectsUpdated = rects.merge(rectsEntered)
            .attr('x', (d, i) => x(i + 1))
            .attr('width', x.bandwidth())
            .transition(300)
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]));

        rects.exit().remove();
    }
}
