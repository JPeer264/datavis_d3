import $ = require('jquery');
import d3 = require('d3');
// load foundation
import '../../vendor/js/foundation.js';

import { BarChart } from '../../plots/barchart';
import { PieChart } from '../../plots/piechart';

const barchart = new BarChart('.barchart');
const piechart = new PieChart('.piechart');
const piechart2 = new PieChart('.piechart2');
const piechart3 = new PieChart('.piechart3');

d3.csv('assets/data/students.csv', (err, data) => {
    let barinfo = {
        data: []
    };

    for (let person of data) {
        barinfo.data.push({
            x: person.famrel,
            y: person.goout
        });
   }

   barchart.update(barinfo);
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