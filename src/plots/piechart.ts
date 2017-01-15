import $  = require('jquery');
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

        this.addHeader("h3");

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

    // @todo Get name of the heading
    public addHeader(tag:string, headerText: string = 'HEADER'): void {
        $(this.options.selector).append(`<${tag}>${headerText}</${tag}>`);
    }

    public update(newData): void {
        const self = this;
        const radius = Math.min(this.options.width, this.options.height) / 2;
        const dataKey = this.options.dataKey;
        const globalData = newData || this.data;

        const pieData = [];
        const tempData = {};
        const colorArray = [];

        const arcTween = function (d, index) {
            var i = d3.interpolate(this._current, d);

            this._current = i(0);

            return t => arc(i(t), index);
        }

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

        // Adds the legend
        // @todo Add the full name of the key
        // @todo Make sure the legend only renders once
        let legend = this.svg.append("g")
            .attr("class", "legend")
            .attr("x", 400)
            .attr("y", 250)
            .attr("height", 100)
            .attr("width", 100);

        legend.selectAll('g').data(pieData)
            .enter()
            .append('g')
            .each(function(d, i) {
                let g = d3.select(this);

                const key = Object.keys(self.options.keys)[i];
                let fillColor = self.options.keys[key].color;

                g.append("rect")
                    .attr("x", 0)
                    .attr("y", 230 + i*40)
                    .attr("width", 30)
                    .attr("height", 30)
                    .style("fill", fillColor);

                g.append("text")
                    .attr("x", 44)
                    .attr("y", 242 + i*40 + 9)
                    .attr("height",30)
                    .attr("width",100)
                    .style("fill", fillColor)
                    .text(pieData[i]['label'])
                    .attr("font-size", "18pt");
            });
    }
}
