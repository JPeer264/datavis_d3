import $ = require('jquery');
import d3 = require('d3');
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { Data } from './Data';

const barchart = new BarChart('.barchart');

const getData = new Data('assets/data/students.csv');

function showCharts(selectionNum, selectionBin) {

    /* Shows the summary page */
    $('.board--choices').fadeOut({
        duration: 300,
        done: () => $('.summary').fadeIn(300)
    });

    barchart.addHeader("h1", selectionNum);



    getData.render((err, data) => {
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

        getData.addPieChart(piechart, piechart2, piechart3);

        barchart.update(data.barinfo);

        getData.updateCharts();

    })
}


/* Loads the options from the json file and inserts it in the start page */
function loadOptions(){
    $.getJSON("assets/data/options.json", function(result){

        /* Seperates the data in the different types */
        const typeObj = {};
        for (let key in result){
            if (!typeObj[result[key].type]) {
                typeObj[result[key].type] = {}
            }
            typeObj[result[key].type][key] = result[key].name
        }

        /* Inserts the different keys into the option fields */
        let counter = 1;
        for (let optionsKey in typeObj){
            for (let key in typeObj[optionsKey]){
                $('#selection-'+counter)
                    .append(`<option value="${key}">${typeObj[optionsKey][key]}</option>`);
            }
            counter += 1;
        }
    });
}


/* Adds functionality to the buttons so that the user can set his choices */
function setChoices(){

    /* Enables the button if both choices are selected */
    $('.choice--custom select').change(function(){
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin) {
            $('.choice--custom + p').removeClass("disabled");
            $('.choice--custom').addClass("enabled");
        }
    });

    /* Predefined choice 1: alcohol consumption and sex */
    $('#choice-1').click(function(){
        showCharts("walc", "sex");
    });

    /* Predefined choice 2: going out & parents cohabitation status */
    $('#choice-2').click(function(){
        showCharts("goout", "pstatus");
    });

    /* Custom choice: Ability to have custom choices */
    $('#choice-3, .choice--custom').click(function(){
        let selectionNum = $('#selection-1').val();
        let selectionBin = $('#selection-2').val();

        if (selectionNum && selectionBin){
            showCharts(selectionNum, selectionBin);
        }
    });
}


loadOptions();
setChoices();
