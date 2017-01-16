"use strict";
var $ = require("jquery");
var d3 = require("d3");
exports.createTooltip = function () {
    var $tooltip = $('.tooltip');
    if ($tooltip.length === 0) {
        d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('class', 'hidden');
    }
    return d3.select('.tooltip');
};
