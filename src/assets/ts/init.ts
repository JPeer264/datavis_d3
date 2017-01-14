import $ = require('jquery');
import d3 = require('d3');
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { ChartManager } from './ChartManager';

const manager = new ChartManager('assets/data/students.csv');

const showCharts = (stackedObj, xObj): void => {

    /* Shows the summary page */
    $('.board--choices').fadeOut({
        duration: 300,
        done: () => $('.summary').fadeIn(300)
    });

    manager.render((err, data) => {
        const barchart = new BarChart({
            selector: '.barchart',
            manager,
            data
        });
        const piechart = new PieChart(data.data, {
            dataKey: 'sex',
            selector: '.piechart',
            keys: {
                'F': {
                    color: '#FF0000',
                    name: 'Female'
                },
                'M': {
                    color: '#0000FF',
                    name: 'Male'
                }
            }
        });
        const piechart2 = new PieChart(data.data, {
            dataKey: 'romantic',
            selector: '.piechart2',
            keys: {
                'no': {
                    color: '#000FFF',
                    name: 'No'
                },
                'yes': {
                    color: '#FFF000',
                    name: 'Yes'
                }
            }
        });
        const piechart3 = new PieChart(data.data, {
            dataKey: 'famsize',
            selector: '.piechart3',
            keys: {
                'GT3': {
                    color: '#000',
                    name: 'Greater than 3'
                },
                'LE3': {
                    color: '#e9e9e9',
                    name: 'Lower than 3'
                }
            }
        });


        manager.addPieChart(piechart, piechart2, piechart3);
        barchart.update(stackedObj, xObj);

        manager.updateCharts();
    });
};

/* Loads the options from the json file and inserts it in the start page */
const loadOptions = (cb = function(result) {}): void => {
    $.getJSON('assets/data/options.json', result => {
        const typeObj: Object = {};

        let counter: number = 1;

        /* Seperates the data in the different types */
        for (let key in result){
            if (!typeObj[result[key].type]) {
                typeObj[result[key].type] = {}
            }

            typeObj[result[key].type][key] = result[key].name
        }

        /* Inserts the different keys into the option fields */
        for (let optionsKey in typeObj){
            for (let key in typeObj[optionsKey]){
                $(`#selection-${ counter }`)
                    .append(`<option value="${key}">${typeObj[optionsKey][key]}</option>`);
            }

            counter += 1;
        }

        cb(result);
    });
};


/* Adds functionality to the buttons so that the user can set his choices */
const setChoices = (): void => {
    /* Enables the button if both choices are selected */
    $('.choice--custom select').change(function(){
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            $('.choice--custom + p').removeClass('disabled');
            $('.choice--custom').addClass('enabled');
        }
    });

    /* Predefined choice 1: alcohol consumption and sex */
    $('#choice-1').click(function(){
        showCharts({
            key: 'sex',
            options: {
                'F': {
                    color: '#FF0000',
                    name: 'Female'
                },
                'M': {
                    color: '#0000FF',
                    name: 'Male'
                }
            }
        }, {
            key: 'Walc'
        });
    });

    /* Predefined choice 2: going out & parents cohabitation status */
    $('#choice-2').click(function(){
        showCharts({
            key: 'Pstatus'
        }, {
            key: 'goout'
        });
    });

    /* Custom choice: Ability to have custom choices */
    $('#choice-3, .choice--custom').click(() => {
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            showCharts({
                key: selectionBin
            }, {
                key: selectionNum
            });
        }
    });
};

loadOptions();
setChoices();
