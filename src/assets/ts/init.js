"use strict";
var $ = require("jquery");
var barchart_1 = require("../../plots/barchart");
var piechart_1 = require("../../plots/piechart");
var ChartManager_1 = require("./ChartManager");
var options_1 = require("../data/options");
var showCharts = function (stackedLabel, stackedX, pieChartArray) {
    var manager = new ChartManager_1.ChartManager('assets/data/students.csv');
    var counter = 1;
    // Shows the chart summary page
    $('.board--choices').fadeOut({
        duration: 300,
        done: function () { return $('.summary').fadeIn(300); }
    });
    manager.render(function (err, data) {
        var pieCharts = [];
        var mainBarChart = new barchart_1.BarChart({
            selector: '#main-barchart',
            interactive: true,
            manager: manager,
            data: data,
            stacked: {
                x: stackedX,
                label: stackedLabel
            }
        });
        // store every piechart into an array
        pieChartArray.forEach(function (value, index) {
            value.selector = "#piechart" + (index + 1);
            pieCharts.push(new piechart_1.PieChart(data.data, value));
        });
        // ================ //
        // == add charts == //
        // ================ //
        manager.addPieChart.apply(manager, pieCharts);
        manager.addBarChart(new barchart_1.BarChart({
            selector: '#barchart1',
            manager: manager,
            data: data,
            compareWithOthers: {
                goout: options_1.jsonData.goout,
                sex: options_1.jsonData.sex
            },
            stacked: {
                x: options_1.jsonData.goout,
                label: options_1.jsonData.pstatus
            }
        }));
        // ============ //
        // == update == //
        // ============ //
        mainBarChart.update();
        manager.updateCharts();
    });
};
// Loads the options from the json file and inserts it in the start page
var loadOptions = function () {
    var typeObj = {};
    var counter = 1;
    // Seperates the data in the different types
    for (var key in options_1.jsonData) {
        if (!typeObj[options_1.jsonData[key].type]) {
            typeObj[options_1.jsonData[key].type] = {};
        }
        typeObj[options_1.jsonData[key].type][key] = options_1.jsonData[key].name;
    }
    // Inserts the different keys into the option fields
    for (var optionsKey in typeObj) {
        for (var key in typeObj[optionsKey]) {
            $("#selection-" + counter)
                .append("<option value=\"" + key + "\">" + typeObj[optionsKey][key] + "</option>");
        }
        counter += 1;
    }
};
// Adds functionality to the buttons so that the user can set his choices
var setChoices = function () {
    // Enables the button if both choices are selected
    $('.choice--custom select').change(function () {
        var selectionNum = $('#selection-1').val();
        var selectionBin = $('#selection-2').val();
        if (selectionNum && selectionBin) {
            $('.choice--custom').addClass('enabled');
            $('.choice--custom + p').removeClass('disabled');
        }
    });
    // Predefined choice 1: alcohol consumption and sex
    $('#choice-1').click(function () {
        showCharts(options_1.jsonData.sex, options_1.jsonData.walc, [options_1.jsonData.romantic, options_1.jsonData.pstatus, options_1.jsonData.address]);
    });
    // Predefined choice 2: going out & parents cohabitation status
    $('#choice-2').click(function () {
        showCharts(options_1.jsonData.pstatus, options_1.jsonData.goout, [options_1.jsonData.romantic, options_1.jsonData.sex, options_1.jsonData.address]);
    });
    // Custom choice: Ability to have custom choices
    // @todo check if one of the objects is selected
    $('#choice-3, .choice--custom').click(function () {
        var selectionNum = $('#selection-1').val();
        var selectionBin = $('#selection-2').val();
        var pieArray = [options_1.jsonData.romantic, options_1.jsonData.pstatus, options_1.jsonData.sex, options_1.jsonData.address];
        pieArray = pieArray.filter(function (d, i) {
            if (d.key === selectionBin || d.key === selectionNum) {
                return false;
            }
            return true;
        });
        if (pieArray.length === 4) {
            pieArray = pieArray.slice(0, 3);
        }
        if (selectionNum && selectionBin) {
            showCharts(options_1.jsonData[selectionBin], options_1.jsonData[selectionNum], pieArray);
        }
    });
};
var showChoices = function () {
    // Shows the summary page
    $('.backBtn').click(function () {
        $('.summary').fadeOut({
            duration: 300,
            done: function () {
                $('.board--choices').fadeIn(300);
                $('.barchart, .piechart').empty();
                $('.choice--custom form')[0].reset();
                $('.choice--custom').removeClass("enabled");
                $('.choice--custom + p').addClass("disabled");
            }
        });
    });
};
loadOptions();
setChoices();
showChoices();
