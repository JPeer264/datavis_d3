import d3 = require('d3');

export class ChartManager {
    public data: Array<Object>;
    public pieData: Array<Object>;
    public pieCharts: Array<any> = [];
    public barCharts: Array<any> = [];

    constructor(private csvFile: String) {
    }

    render(cb: Function) {
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
           this.pieData = data;

           cb(err, {
               data,
               barinfo
           });
        });
    }

    updateCharts() {
        // update piecharts
        for (let pieChart of this.pieCharts) {
            pieChart.update(this.pieData);
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

    filterData(filterObject) {
        const newData = [];

        for (let item of this.data) {
            let acceptArray = [];

            for (let filterOption in filterObject) {
                if (item[filterOption] === filterObject[filterOption]) {
                    acceptArray.push(true);
                }
            }

            if (acceptArray.length === Object.keys(filterObject).length) {
                newData.push(item);
            }
        }

        this.pieData = newData;
    }

    releaseFilter() {
        this.pieData = this.data;
    }
}
