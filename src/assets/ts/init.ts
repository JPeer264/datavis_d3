import $ = require('jquery');
import d3 = require('d3');
// load foundation
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { Data } from './Data';

const barchart = new BarChart('.barchart');


const getData = new Data('assets/data/students.csv');


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

    /* Loads the options from the json file and inserts in the start page */
    function loadOptions(){
        $.getJSON("assets/data/options.json", function(result){

            let counter = 1;

            for (let optionsKey in result){
                for (let key in result[optionsKey]){
                    $('#selection-'+counter).append(`<option value="${key}">${result[optionsKey][key]}</option>`);
                }
                counter += 1;
            }
        });
    }

    function setChoices(){
        $('#choice-1').click(function(){
            console.log("walc", "sex");
            barchart.addHeader("h1", "blub");
        });

        $('#choice-2').click(function(){
            console.log("goout", "pstatus");
        });

        $('#choice-3, .choice--custom').click(function(){
            let selectionNum = $('#selection-1').val();
            let selectionBin = $('#selection-2').val();

            if (selectionNum && selectionBin){
                console.log(selectionNum, selectionBin);
                barchart.addHeader("h1", selectionNum);
            }
        });
    }

    function init(){

        /* Enables the custom choice if both options are selected */
        $('.choice--custom select').change(function(){
            let selectionNum = $('#selection-1').val();
            let selectionBin = $('#selection-2').val();

            if (selectionNum && selectionBin) {
                $('.choice--custom + p').removeClass("disabled");
                $('.choice--custom').addClass("enabled");
            }
        });
    }

    init();
    loadOptions();
    setChoices();
});
