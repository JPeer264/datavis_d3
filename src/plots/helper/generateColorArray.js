"use strict";
var options_1 = require("../../assets/data/options");
exports.generateColorArray = function (options, expectedKeys) {
    var colorArray = [];
    if (options && toString.call(options) === '[object Array]') {
        for (var _i = 0, options_2 = options; _i < options_2.length; _i++) {
            var option = options_2[_i];
            if (options_1.chartOptions[option] && options_1.chartOptions[option].color) {
                colorArray.push(options_1.chartOptions[option].color);
            }
            else {
                var randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                colorArray.push(randomColor);
            }
        }
    }
    else {
        for (var label in expectedKeys) {
            var randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
            colorArray.push(randomColor);
        }
    }
    return colorArray;
};
