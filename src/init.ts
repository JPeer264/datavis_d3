import $ = require('jquery');
// load foundation
import './vendor/js/foundation.js';

import { BarChart } from './plots/barchart';
import { PieChart } from './plots/piechart';

const barchart = new BarChart('.barchart');
const piechart = new PieChart('.piechart');
const piechart2 = new PieChart('.piechart2');
const piechart3 = new PieChart('.piechart3');
