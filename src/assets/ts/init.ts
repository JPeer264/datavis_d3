import $ = require('jquery');
import d3 = require('d3');
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { ChartManager } from './ChartManager';

const manager = new ChartManager('assets/data/students.csv');

const showCharts = (stackedObj, xObj, pieChartObj): void => {

    /* Shows the summary page */
    $('.board--choices').fadeOut({
        duration: 0,
        done: () => $('.summary').fadeIn(300)
    });

    /* Generates the selector classes for the piecharts */
    let counter = 1;
    for (let pieObj of pieChartObj) {
        pieObj.selector = ".piechart" + counter;
        counter += 1;
    }

    manager.render((err, data) => {
        const barchart = new BarChart({
            selector: '.barchart',
            manager,
            data
        });

        const pieCharts = [];

        for (let d of pieChartObj) {
            pieCharts.push(new PieChart(data.data, d));
        }

        manager.addPieChart(...pieCharts);
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

    let romanticPieObj = {
        dataKey: 'romantic',
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
    };

    let pstatusPieObj = {
        dataKey: 'pstatus',
        keys: {
            't': {
                color: '#ff7e43',
                name: 'Living together'
            },
            'a': {
                color: '#5ebbd9',
                name: 'Living apart'
            }
        }
    };

    let sexPieObj = {
        dataKey: 'sex',
        keys: {
            'f': {
                color: '#ff7e43',
                name: 'Female'
            },
            'm': {
                color: '#5ebbd9',
                name: 'Male'
            }
        }
    };

    let addressPieObj = {
        dataKey: 'address',
        keys: {
            'r': {
                color: '#3fb76f',
                name: 'Rural'
            },
            'u': {
                color: '#b386be',
                name: 'Urban'
            }
        }
    };

    /* Predefined choice 1: alcohol consumption and sex */
    $('#choice-1').click(function(){
        showCharts({
            key: 'sex',
            options: {
                'f': {
                    color: '#ff7e43',
                    name: 'Female'
                },
                'm': {
                    color: '#5ebbd9',
                    name: 'Male'
                }
            }
        }, {
            key: 'walc'
        }, [romanticPieObj, pstatusPieObj, addressPieObj]);
    });

    /* Predefined choice 2: going out & parents cohabitation status */
    $('#choice-2').click(function(){
        showCharts({
            key: 'pstatus'
        }, {
            key: 'goout'
        }, [romanticPieObj, sexPieObj, addressPieObj]);
    });

    /* Custom choice: Ability to have custom choices */
    // @todo check if one of the objects is selected
    $('#choice-3, .choice--custom').click(() => {
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            showCharts({
                key: selectionBin
            }, {
                key: selectionNum
            }, [romanticPieObj, pstatusPieObj, sexPieObj]);
        }
    });
};

loadOptions();
setChoices();
