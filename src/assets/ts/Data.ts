import d3 = require('d3');

export class Data {
    public data: Object;
    public pieCharts: Array<any> = [];
    public barCharts: Array<any> = [];

    constructor(private csvFile: String) {
    }

    start(cb: Function) {
        d3.csv(this.csvFile, (err, data) => {
            let barinfo = {
                data: []
            };

            for (let person of data) {
                barinfo.data.push({
                    x: person.famrel,
                    y: person.goout
                });
           }

           this.data = data;

           cb(err, {
               data,
               barinfo
           });
        });
    }

    updateCharts() {
        // update piecharts
        for (let pieChart of this.pieCharts) {
            pieChart.update(this.data);
        }

        // update piecharts
        for (let barChart of this.barCharts) {
            barChart.update(this.data);
        }
    }

    addPieChart(...charts) {
        this.pieCharts = this.pieCharts.concat(charts)
    }

    addBarChart(...charts) {
        this.barCharts = this.barCharts.concat(charts)
    }
}
