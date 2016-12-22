import $ = require('jquery');
// load foundation
import './vendor/js/foundation.js';

import { BarChart } from './plots/barchart';
import { PieChart } from './plots/piechart';

const barchart = new BarChart('.barchart');
const piechart = new PieChart('.piechart');

// @todo embed css/style.css
// @todo embed vendor/css/foundation.min.css