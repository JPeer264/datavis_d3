import $  = require('jquery');
import d3 = require('d3');

export const createTooltip = () => {
    const $tooltip = $('.tooltip');

    if ($tooltip.length === 0) {
        d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('class', 'hidden');
    }

    return d3.select('.tooltip');
};
