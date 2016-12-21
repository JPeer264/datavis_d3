import $ = require('jquery');

import { BarChart } from './plots/barchart';
import { PieChart } from './plots/piechart';

const $body = $('body');

$body.html('Plots by d3 will be generated here.');
$body.append('<div class="barchart"></div>');
$body.append('<div class="piechart"></div>');

const barchart = new BarChart('.barchart');
const piechart = new PieChart('.piechart');

// @todo embed css/style.css
// @todo embed vendor/css/foundation.min.css
// @todo embed vendor/js/foundation.min.js