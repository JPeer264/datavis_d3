import $ = require('jquery');
import { BarChart } from './plots/barchart';

const $body = $('body');

$body.html('Plots by d3 will be generated here.');
$body.append('<div class="barchart"></div>')

const barchart = new BarChart('.barchart');
