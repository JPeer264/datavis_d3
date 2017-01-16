"use strict";
var $ = require("jquery");
var d3 = require("d3");
var options_1 = require("../assets/data/options");
var helper_1 = require("./helper");
var BarChart = (function () {
    function BarChart(options) {
        this.options = options;
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
        this._width = 800; // - this.margin.left - this.margin.right;
        this._height = 440; //- this.margin.top  - this.margin.bottom;
        options.manager = options.manager || {};
        options.selector = options.selector || 'body';
        options.className = options.className || 'chart';
        var x = d3.scaleLinear()
            .domain([1, 5])
            .range([100, this._width - 100]);
        this.compareSelector = options.selector.slice(1, options.selector.length);
        for (var stackedKey in options.stacked) {
            this.compareSelector += "-" + options.stacked[stackedKey].key;
        }
        this.svg = d3.select(options.selector)
            .append('div')
            .classed('svg-container', true)
            .classed('svg-container--barchart', true)
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 1050 550')
            .classed('svg-content-responsive', true)
            .append('g');
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
        this.svg.append("g")
            .attr("transform", "translate(0," + (this._height + 10) + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x)
            .ticks(5))
            .attr('font-size', '18pt');
        this.tooltip = helper_1.createTooltip();
        // interactive options
        if (options.interactive) {
            this.addHeader("h1", helper_1.getStackedNames(options.stacked));
        }
        // register comparing
        if (options.compareWithOthers) {
            var compareObj = options_1.jsonData;
            var selectOptions = '';
            if (toString.call(options.compareWithOthers) === '[object Object]') {
                compareObj = options.compareWithOthers;
            }
            for (var label in compareObj) {
                var value = compareObj[label];
                selectOptions += "<option value=\"" + value.key + "\">" + value.name + "</option>";
            }
            $("\n                <p class=\"compare-charts text-center\">\n                    <strong>" + options.stacked.x.name + "</strong> &\n                    <select id=\"" + this.compareSelector + "\">\n                        <option selected value=\"" + options.stacked.label.key + "\">" + options.stacked.label.name + "</option>\n                        " + selectOptions + "\n                    </select>\n                </p>\n            ").insertBefore(options.selector);
            var self_1 = this;
            console.log(options);
            $(document).on('change', "select#" + this.compareSelector, function () {
                var $this = $(this);
                ();
                options.stacked.label = options_1.jsonData[$this.val()];
                options.manager.updateCharts();
            });
        }
    }
    BarChart.prototype.prepareStackedData = function (stackedLabel, stackedX, data) {
        if (data === void 0) { data = this.options.data.data; }
        var chooser = stackedX.key;
        var seperator = stackedLabel.key;
        var keyOptions = stackedLabel.options;
        var result = [];
        var seperatedData = {};
        var xRange = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var d = data_1[_i];
            if (!seperatedData[d[seperator]]) {
                seperatedData[d[seperator]] = {};
            }
            if (!seperatedData[d[seperator]][d[chooser]]) {
                seperatedData[d[seperator]][d[chooser]] = 0;
            }
            seperatedData[d[seperator]][d[chooser]] += 1;
        }
        for (var _a = 0, _b = this.options.stacked.label.options; _a < _b.length; _a++) {
            var label = _b[_a];
            var counter = 0;
            var startPoint = 0;
            var appendArray = [];
            if (!seperatedData[label]) {
                seperatedData[label] = {};
            }
            // hardcoded... fill up missing keys
            seperatedData[label][1] = seperatedData[label][1] || 0;
            seperatedData[label][2] = seperatedData[label][2] || 0;
            seperatedData[label][3] = seperatedData[label][3] || 0;
            seperatedData[label][4] = seperatedData[label][4] || 0;
            seperatedData[label][5] = seperatedData[label][5] || 0;
            for (var key in seperatedData[label]) {
                var toAppend = void 0;
                var value = seperatedData[label][key];
                startPoint = 0;
                // -- stacking --
                // set the startPoint to
                // the previous highest point
                if (result.length > 0) {
                    startPoint = result[result.length - 1][counter][1];
                }
                toAppend = [startPoint, value + startPoint];
                toAppend.data = {
                    filterData: (_c = {},
                        _c[seperator] = label,
                        _c[chooser] = key,
                        _c)
                };
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
            colorArray: helper_1.generateColorArray(keyOptions, seperatedData),
            xRange: xRange
        };
        return result;
        var _c;
    };
    // @todo Get name of the heading
    BarChart.prototype.addHeader = function (tag, headerText) {
        if (headerText === void 0) { headerText = 'HEADER'; }
        $(this.options.selector).append("<" + tag + ">" + headerText + "</" + tag + ">");
    };
    BarChart.prototype.update = function (data) {
        var _this = this;
        if (data === void 0) { data = undefined; }
        var self = this;
        var stack = d3.stack();
        var manager = this.options.manager;
        var isTooltip = false;
        var stackedData = this.prepareStackedData(this.options.stacked.label, this.options.stacked.x, data);
        var width = this._width;
        var height = this._height;
        var x = this.x;
        var y = this.y;
        // let tooltip = d3.select('body').append('div')
        //     .attr('class', 'tooltip')
        //     .style('opacity', 0);
        // Scale the range of the data in the domains
        // @todo get right z.domain
        x.domain(stackedData.data.xRange);
        y.domain([0, d3.max(stackedData[stackedData.length - 1], function (d) { return d[1]; })]);
        // Adds the legend
        this.legend.selectAll('g').data(stackedData)
            .enter()
            .append('g')
            .each(function (d, i) {
            var g = d3.select(this);
            g.append('rect')
                .attr('x', width + 20)
                .attr('y', (height / 2 - 30) + i * 40)
                .attr('width', 24)
                .attr('height', 24)
                .style('fill', function (d) { return options_1.chartOptions[d.key].color; });
            g.append('text')
                .attr('x', width + 54)
                .attr('y', (height / 2 - 10) + i * 40)
                .attr('height', 30)
                .attr('width', 100)
                .style('fill', '#333')
                .text(options_1.chartOptions[d.key].name)
                .attr('font-size', '16pt');
        });
        var categories = this.svg.selectAll('.category')
            .data(stackedData);
        var categoriesEntered = categories.enter()
            .append('g')
            .attr('class', 'category');
        var categoriesUpdated = categories.merge(categoriesEntered)
            .attr('fill', function (d) { return options_1.chartOptions[d.key].color; });
        categories.exit().remove();
        var rects = categoriesUpdated.selectAll('rect')
            .data(function (d) { return d; });
        var rectsEntered = rects.enter()
            .append('rect')
            .attr('class', function (d, i) {
            return "rect interactive-rect-" + Object.keys(d.data.filterData).join('-');
        })
            .attr('x', function (d, i) { return x(i + 1); })
            .attr('y', function (d) { return y(d[1]); })
            .attr('height', function (d) { return y(d[0]) - y(d[1]); })
            .attr('width', x.bandwidth())
            .on('mouseover', function () {
            _this.tooltip.classed('hidden', false);
        })
            .on('mouseout', function () {
            _this.tooltip.classed('hidden', true);
        })
            .on('mousemove', function (d) {
            var xPosition = d3.mouse($('body')[0])[0] - 20 - ($('.tooltip').width() / 2);
            var yPosition = d3.mouse($('body')[0])[1] - 80 - $(window).scrollTop() - ($('.tooltip').height() / 2);
            var text = '';
            var amount = d[1] - d[0];
            for (var key in d.data.filterData) {
                var value = d.data.filterData[key];
                var textValue = value;
                if (options_1.chartOptions[value] && options_1.chartOptions[value].name) {
                    textValue = options_1.chartOptions[value].name;
                }
                text += options_1.jsonData[key].name + ": <strong>" + textValue + "</strong><br>";
            }
            self.tooltip.style('transform', "translate(" + xPosition + "px, " + yPosition + "px)");
            self.tooltip.html("<strong>" + amount + " People</strong><br>" + text);
        })
            .on('click', function (d, i) {
            console.log(d);
            var $this = $(this);
            var selectors = {
                thisClass: ".interactive-rect-" + Object.keys(d.data.filterData).join('-'),
                yourSelection: '#your-selection',
                selection: '.selection'
            };
            var isFirstLoop = true;
            var yourSelectionText = '';
            if (self.options.interactive) {
                // ============================================================ //
                // == unselect all, if clicked on an active barchart section == //
                // ============================================================ //
                if ($this.hasClass('rect-active')) {
                    $(selectors.thisClass).removeClass('low-alpha rect-active');
                    $(selectors.selection).removeClass('selection--active');
                    $(selectors.yourSelection).slideUp({
                        duration: 300,
                        done: function () {
                            $(selectors.yourSelection).html('');
                        }
                    });
                    manager.releaseFilter();
                    manager.updateCharts();
                    return;
                }
                // ============================== //
                // == another barchart section == //
                // ============================== //
                for (var label in d.data.filterData) {
                    var value = d.data.filterData[label];
                    var textValue = value;
                    var prefix = ' & ';
                    if (isFirstLoop) {
                        prefix = '';
                        isFirstLoop = false;
                    }
                    if (options_1.chartOptions[value] && options_1.chartOptions[value].name) {
                        textValue = options_1.chartOptions[value].name;
                    }
                    yourSelectionText += "" + prefix + options_1.jsonData[label].name + ": <strong>" + textValue + "</strong>";
                }
                manager.filterData(d.data.filterData);
                manager.updateCharts();
                $(selectors.yourSelection).html(yourSelectionText);
                $(selectors.selection).slideDown(300);
                $(selectors.thisClass).removeClass('low-alpha rect-active');
                $(selectors.thisClass).addClass('low-alpha');
                $this.removeClass('low-alpha');
                $this.addClass('rect-active');
            }
        });
        var rectsUpdated = rects.merge(rectsEntered)
            .attr('x', function (d, i) { return x(i + 1); })
            .attr('width', x.bandwidth())
            .transition(300)
            .attr('y', function (d) { return y(d[1]); })
            .attr('height', function (d) { return y(d[0]) - y(d[1]); });
        rects.exit().remove();
    };
    return BarChart;
}());
exports.BarChart = BarChart;
