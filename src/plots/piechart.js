"use strict";
var $ = require("jquery");
var d3 = require("d3");
var options_1 = require("../assets/data/options");
var helper_1 = require("./helper");
var PieChart = (function () {
    function PieChart(data, options) {
        this.data = data;
        this.options = options;
        options = options || {};
        options.keys = options.keys || {};
        options.width = 360;
        options.height = 360;
        options.selector = options.selector || 'body';
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
        this.tooltip = helper_1.createTooltip();
    }
    //////////////////
    // == PUBLIC == //
    //////////////////
    PieChart.prototype.addHeader = function (tag, headerText) {
        if (headerText === void 0) { headerText = 'HEADER'; }
        $(this.options.selector).append("<" + tag + ">" + headerText + "</" + tag + ">");
    };
    PieChart.prototype.prepareData = function (data) {
        var pieData = [];
        var seperator = this.options.key;
        var seperatedData = {};
        // split values from dataKey
        for (var d in data) {
            if (!seperatedData[data[d][seperator]]) {
                seperatedData[data[d][seperator]] = 1;
            }
            else {
                seperatedData[data[d][seperator]] += 1;
            }
        }
        for (var _i = 0, _a = this.options.options; _i < _a.length; _i++) {
            var label = _a[_i];
            var count = seperatedData[label];
            pieData.push({
                label: label,
                count: count
            });
        }
        return pieData;
    };
    PieChart.prototype.update = function (data) {
        if (data === void 0) { data = this.data; }
        var pieData = this.prepareData(data);
        // =============== //
        // == FUNCTIONS == //
        // =============== //
        this.addLegend(pieData);
        this.addChart(pieData);
    };
    ///////////////////
    // == PRIVATE == //
    ///////////////////
    PieChart.prototype.addChart = function (data) {
        var _this = this;
        var self = this;
        var radius = Math.min(this.options.width, this.options.height) / 2;
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        var pie = d3.pie()
            .value(function (d) { return d.count; })
            .sort(null);
        var path = this.svg.selectAll('path')
            .data(pie(data));
        var arcTween = function (d, index) {
            var i = d3.interpolate(this._current, d);
            this._current = i(0);
            return function (t) { return arc(i(t), index); };
        };
        path.enter()
            .append('path')
            .on('mouseover', function () {
            _this.tooltip.classed('hidden', false);
        })
            .on('mouseout', function () {
            _this.tooltip.classed('hidden', true);
        })
            .on('mousemove', function (d) {
            var xPosition = d3.mouse($('body')[0])[0] - 20 - ($('.tooltip').width() / 2);
            var yPosition = d3.mouse($('body')[0])[1] - 50 - $(window).scrollTop() - ($('.tooltip').height() / 2);
            var text = options_1.chartOptions[d.data.label].name + ": <b>" + d.data.count + " People</b>";
            self.tooltip.style('transform', "translate(" + xPosition + "px, " + yPosition + "px)");
            self.tooltip.html(text);
        })
            .attr('class', 'enter')
            .attr('class', 'path')
            .attr('d', arc)
            .attr('fill', function (d) { return options_1.chartOptions[d.data.label].color; })
            .transition()
            .duration(750)
            .attrTween('d', arcTween);
        path.attr('class', 'update')
            .attr('fill', function (d) { return options_1.chartOptions[d.data.label].color; })
            .transition()
            .duration(750)
            .attrTween('d', arcTween);
        path.exit()
            .attr('class', 'exit')
            .transition()
            .duration(750)
            .attrTween('d', arcTween)
            .remove();
    };
    PieChart.prototype.addLegend = function (data) {
        // @todo Add the full name of the key
        var legend = this.svg
            .selectAll('g').data(data);
        var legendEnter = legend.enter()
            .append('g')
            .attr('class', 'legend')
            .attr('x', 0)
            .attr('y', 250)
            .attr('height', 100)
            .attr('width', 100)
            .each(function (d, i) {
            var g = d3.select(this);
            var label = data[i]['label'];
            var name = options_1.chartOptions[label].name;
            g.append('rect')
                .attr('x', -100)
                .attr('y', 210 + i * 50)
                .attr('width', 34)
                .attr('height', 34)
                .style('fill', function (d) { return options_1.chartOptions[d.label].color; });
            g.append('text')
                .attr('x', -50)
                .attr('y', 239 + i * 50)
                .attr('height', 30)
                .attr('width', 100)
                .style('fill', '#333')
                .text(name)
                .attr('font-size', '24pt');
        });
        legend.exit().remove();
    };
    return PieChart;
}());
exports.PieChart = PieChart;
