import d3 = require('d3');
import $ = require('jquery');

export class BarChart {
    public x;
    public y;
    public svg;
    public tooltip;
    public margin = {top: 20, right: 20, bottom: 30, left: 40};
    public _width:number  = 960; // - this.margin.left - this.margin.right;
    public _height:number = 500; //- this.margin.top  - this.margin.bottom;

    // constructor(public selector: string = 'body', public className: string = 'chart') {
    constructor(private options) {
        options.manager = options.manager || {}
        options.selector = options.selector || 'body',
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

    public prepareStackedData(stackedObj, xObj, data = this.options.data.data) {
        const result: any = [];
        const colors: Array<String> = [];
        const chooser = xObj.key;
        const seperator = stackedObj.key;
        const seperatedData = {};

        for (let d of data) {
            if (!seperatedData[d[seperator]]) {
                seperatedData[d[seperator]] = {};
            }

            if (!seperatedData[d[seperator]][d[chooser]]) {
                seperatedData[d[seperator]][d[chooser]] = 0
            }

            seperatedData[d[seperator]][d[chooser]] += 1;
        }

        let xRange = [];

        for (let sKey in seperatedData) {
            let counter = 0;
            let appendArray = [];
            let startPoint = 0;

            // hardcoded... fill up missing keys
            seperatedData[sKey][1] = seperatedData[sKey][1] || 0;
            seperatedData[sKey][2] = seperatedData[sKey][2] || 0;
            seperatedData[sKey][3] = seperatedData[sKey][3] || 0;
            seperatedData[sKey][4] = seperatedData[sKey][4] || 0;
            seperatedData[sKey][5] = seperatedData[sKey][5] || 0;

            // set color for z.domain
            if (stackedObj.options && stackedObj.options[sKey].color) {
                colors.push(stackedObj.options[sKey].color);
            } else {
                let randomColor = "#"+((1<<24)*Math.random()|0).toString(16);

                colors.push(randomColor);
            }

            for (let key in seperatedData[sKey]) {
                let toAppend: any;
                let value: any = seperatedData[sKey][key];

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
                        [seperator]: sKey,
                        [chooser]: key
                    }
                }

                appendArray.push(toAppend)

                counter += 1;
            }

            xRange = Object.keys(seperatedData[sKey])


            result.push(appendArray);

            // append as required in D3.stack()
            result[result.length - 1].index = result.length - 1;
            result[result.length - 1].key = sKey;
        }

        result.data = {
            colors,
            xRange
        };

        return result;
    }

    // @todo Get name of the heading
    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(this.options.selector).append(`<${tag}>${headerText}</${tag}>`);
    }

    public update(data = undefined): void {
        const self = this;
        const stackedData = this.prepareStackedData(this.options.stacked.label, this.options.stacked.x, data);
        const isTooltip = false;
        const manager = this.options.manager;
        const stack = d3.stack();

        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        let x = this.x;
        let y = this.y;
        let z = d3.scaleOrdinal()
            .range(stackedData.data.colors);
        let width = this._width;
        let height = this._height;

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
                    .style("fill", stackedData.data.colors[i]);

                g.append("text")
                    .attr("x", width - 130)
                    .attr("y", 24 + i*40 + 9)
                    .attr("height",30)
                    .attr("width",100)
                    .style("fill", stackedData.data.colors[i])
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
