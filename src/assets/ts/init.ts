import $ = require('jquery');
import d3 = require('d3');
// load foundation
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';
import { Data } from './Data';

const barchart = new BarChart('.barchart');


const getData = new Data('assets/data/students.csv');


getData.start((err, data) => {
    const piechart = new PieChart(data.data, 'sex', '.piechart');
    const piechart2 = new PieChart(data.data, 'sex', '.piechart2');
    const piechart3 = new PieChart(data.data, 'sex', '.piechart3');

    getData.addPieChart(piechart, piechart2, piechart3);

    barchart.update(data.barinfo);

    getData.updateCharts();
});

$(function(){

    /* Loads the options from the json file and inserts in the start page */
    function loadOptions(){
        $.getJSON("assets/data/options.json", function(result){

            let counter = 1;

            for (let optionsKey in result){
                for (let key in result[optionsKey]){
                    $('#selection-'+counter).append(
                        "<option value=\"" +
                        key +
                        "\">" +
                        result[optionsKey][key] +
                        "</option>");
                }
                counter += 1;
            }
        });
    }

    function setChoices(){
        $('#choice-1').click(function(){
            renderCharts("walc", "sex");
        });

        $('#choice-2').click(function(){
            renderCharts("goout", "pstatus");
        });

        $('#choice-3, .choice--custom').click(function(){
            let selectionNum = $('#selection-1').val();
            let selectionBin = $('#selection-2').val();

            if (selectionNum && selectionBin){
                renderCharts(selectionNum, selectionBin);
            }
        });
    }

    function renderCharts(choiceNum, choiceBin){
        console.log("Should render the charts with: " + choiceNum + " & " + choiceBin);
    }

    function init(){

        /* Enables the button if there are both options selected */
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