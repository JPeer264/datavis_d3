"use strict";
var d3 = require("d3");
var ChartManager = (function () {
    function ChartManager(csvFile) {
        this.csvFile = csvFile;
        this.pieCharts = [];
        this.barCharts = [];
    }
    ChartManager.prototype.render = function (cb) {
        var _this = this;
        d3.csv(this.csvFile, function (err, data) {
            _this.data = _this.filteredData = data;
            cb(err, {
                data: data
            });
        });
    };
    ChartManager.prototype.updateCharts = function () {
        // update piecharts
        for (var _i = 0, _a = this.pieCharts; _i < _a.length; _i++) {
            var pieChart = _a[_i];
            pieChart.update(this.filteredData);
        }
        // update piecharts
        for (var _b = 0, _c = this.barCharts; _b < _c.length; _b++) {
            var barChart = _c[_b];
            barChart.update(this.filteredData);
        }
    };
    ChartManager.prototype.addPieChart = function () {
        var charts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            charts[_i] = arguments[_i];
        }
        this.pieCharts = this.pieCharts.concat(charts);
    };
    ChartManager.prototype.addBarChart = function () {
        var charts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            charts[_i] = arguments[_i];
        }
        this.barCharts = this.barCharts.concat(charts);
    };
    ChartManager.prototype.filterData = function (filterObject) {
        var sortedData = [];
        // sort pieData
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var item = _a[_i];
            var acceptArray = [];
            for (var filterOption in filterObject) {
                if (item[filterOption] === filterObject[filterOption]) {
                    acceptArray.push(true);
                }
            }
            if (acceptArray.length === Object.keys(filterObject).length) {
                sortedData.push(item);
            }
        }
        this.filteredData = sortedData;
    };
    ChartManager.prototype.releaseFilter = function () {
        this.filteredData = this.data;
    };
    return ChartManager;
}());
exports.ChartManager = ChartManager;
