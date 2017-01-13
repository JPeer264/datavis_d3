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
        options.selector = options.selector || 'body',
        options.className = options.className || 'chart',
        options.manager = options.manager || {}

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

    public prepareData(data): Array<Object> {
        const newData = {};
        const result  = [];

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
            result.push({
                x: d,
                y: d3.mean(newData[d])
            });
        }

        return result;
    }

    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(`<${tag}>${headerText}</${tag}>`).insertBefore($(this.options.selector));
    }

    public update(barinfo): void {
        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        let x = this.x;
        let y = this.y;
        let width = this._width;
        let height = this._height;

        const data = barinfo.data;
        const dataArray = this.prepareData(data);
        const isTooltip = false;
        const manager = this.options.manager;

        // Scale the range of the data in the domains
        x.domain([1, 2, 3, 4, 5]);
        y.domain([0, d3.max(data, d => d.y)]);

        // https://bl.ocks.org/mbostock/3808234
        let barchart = this.svg.selectAll('rect')
            .data(dataArray);

        // EXIT old elements not present in new data.
        barchart.exit()
            .attr('class', 'exit')
            .remove();

        // UPDATE old elements present in new data.
        barchart.attr('class', 'update')
            .attr('x', d => x(d.x) )
            .attr('width', x.bandwidth())
            .transition(300)
            .attr('y', d => y(d.y) )
            .attr('height', d => height - y(d.y))

        // append the rectangles for the bar chart
        barchart.enter().append('rect')
            .attr('class', 'enter')
            .attr('class', 'interactive-rect')
            .attr('id', (d, i) => {
                return 'interactive-rect-' + i;
            })
            .attr('x', d => x(d.x) )
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.y) )
            .attr('height', d => height - y(d.y))
            // initialize event listeners
            .on('mouseover', d => {
                if (isTooltip) {
                    tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    tooltip.html(d.y)
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
            .on('click', (d, i) => {
                console.log(d)
                if ($('#interactive-rect-' + i).hasClass('rect-active')) {
                    $('.interactive-rect').removeClass('low-alpha rect-active');

                    // @todo remove filter
                    manager.releaseFilter();
                    manager.updateCharts();
                    return;
                }

                // @todo add instead of `sex` and `goout` data from manager.optionOne
                // @todo add instrad of 'M' the current z from the stacked bar chart
                manager.filterData({
                    famsup: 'yes',
                    goout: d.x
                });

                manager.updateCharts();

                $('.interactive-rect').removeClass('low-alpha rect-active');
                $('.interactive-rect').addClass('low-alpha');
                $('#interactive-rect-' + i).removeClass('low-alpha');
                $('#interactive-rect-' + i).addClass('rect-active');
                // @todo apply filter
            });

        // // add the x Axis
        // barchart.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(d3.axisBottom(x));

        // // add the y Axis
        // barchart.append('g')
        //     .call(d3.axisLeft(y));

        return barchart;
    }

}
