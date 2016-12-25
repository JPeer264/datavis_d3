import $ = require('jquery');
import d3 = require('d3');
// load foundation
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';

const barchart = new BarChart('.barchart');
const piechart = new PieChart('.piechart');
const piechart2 = new PieChart('.piechart2');
const piechart3 = new PieChart('.piechart3');

d3.csv('assets/data/students.csv', (err, data) => {
    let barinfo = {
        data: []
    };

    for (let person of data) {
        barinfo.data.push({
            x: person.famrel,
            y: person.goout
        });
   }

   barchart.update(barinfo);
});
