import $  = require('jquery');
import d3 = require('d3');

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { ChartManager } from './ChartManager';
import { jsonData, chartOptions } from '../data/options';

const showCharts = (stackedLabel, stackedX, pieChartArray): void => {
    const manager = new ChartManager('assets/data/students.csv');

    let counter = 1;

    // Shows the chart summary page
    $('.board--choices').fadeOut({
        duration: 300,
        done: () => $('.summary').fadeIn(300)
    });

    manager.render((err, data) => {
        const pieCharts = [];
        const mainBarChart = new BarChart({
            selector: '#main-barchart',
            interactive: true,
            manager,
            data,
            stacked: {
                label: stackedLabel,
                x: stackedX
            }
        });

        // store every piechart into an array
        pieChartArray.forEach((value, index) => {
            value.selector = "#piechart" + (index + 1);

            pieCharts.push(new PieChart(data.data, value));
        });

          // ================ //
         // == add charts == //
        // ================ //
        manager.addPieChart(...pieCharts);
        manager.addBarChart(new BarChart({
            selector: '.barchart1',
            manager,
            data,
            stacked: {
                label: jsonData.pstatus,
                x: jsonData.goout
            }
        }));

          // ============ //
         // == update == //
        // ============ //
        mainBarChart.update();
        manager.updateCharts();
    });
};

// Loads the options from the json file and inserts it in the start page
const loadOptions = (): void => {
    const typeObj: Object = {};

    let counter: number = 1;

    // Seperates the data in the different types
    for (let key in jsonData){
        if (!typeObj[jsonData[key].type]) {
            typeObj[jsonData[key].type] = {}
        }

        typeObj[jsonData[key].type][key] = jsonData[key].name
    }

    // Inserts the different keys into the option fields
    for (let optionsKey in typeObj){
        for (let key in typeObj[optionsKey]){
            $(`#selection-${ counter }`)
                .append(`<option value="${key}">${typeObj[optionsKey][key]}</option>`);
        }

        counter += 1;
    }
};

// Adds functionality to the buttons so that the user can set his choices
const setChoices = (): void => {
    // Enables the button if both choices are selected
    $('.choice--custom select').change(function(){
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            $('.choice--custom + p').removeClass('disabled');
            $('.choice--custom').addClass('enabled');
        }
    });

    // Predefined choice 1: alcohol consumption and sex
    $('#choice-1').click(() => {
        showCharts(jsonData.sex, jsonData.walc, [ jsonData.romantic, jsonData.pstatus, jsonData.address ]);
    });

    // Predefined choice 2: going out & parents cohabitation status
    $('#choice-2').click(() => {
        showCharts(jsonData.pstatus, jsonData.goout, [ jsonData.romantic, jsonData.sex, jsonData.address ]);
    });

    // Custom choice: Ability to have custom choices
    // @todo check if one of the objects is selected
    $('#choice-3, .choice--custom').click(() => {
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            showCharts(jsonData[selectionBin], jsonData[selectionNum], [ jsonData.romantic, jsonData.pstatus, jsonData.sex ]);
        }
    });
};

const showChoices = () => {
    // Shows the summary page
    $('.backBtn').click(() => {
        $('.summary').fadeOut({
            duration: 300,
            done: () => {
                $('.board--choices').fadeIn(300);
                $('#barchart, .piechart').empty();
                $('.choice--custom form')[0].reset();
            }
        });
    });
};

loadOptions();
setChoices();
showChoices();
