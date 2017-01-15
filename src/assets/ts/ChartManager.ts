import d3 = require('d3');

export class ChartManager {
    public data: Array<Object>;
    public filteredData: Array<Object>;
    public pieCharts: Array<any> = [];
    public barCharts: Array<any> = [];

    constructor(private csvFile: String) {
    }

    render(cb: Function) {
        d3.csv(this.csvFile, (err, data) => {
           this.data = this.filteredData = data;

           cb(err, {
               data
           });
        });
    }

    updateCharts() {
        // update piecharts
        for (let pieChart of this.pieCharts) {
            pieChart.update(this.filteredData);
        }

        // update piecharts
        for (let barChart of this.barCharts) {
            barChart.update(this.filteredData);
        }
    }

    addPieChart(...charts) {
        this.pieCharts = this.pieCharts.concat(charts)
    }

    addBarChart(...charts) {
        this.barCharts = this.barCharts.concat(charts)
    }

    filterData(filterObject) {
        const sortedPieData = [];

        console.log(filterObject)

        // sort pieData
        for (let item of this.data) {
            let acceptArray = [];

            for (let filterOption in filterObject) {
                if (item[filterOption] === filterObject[filterOption]) {
                    acceptArray.push(true);
                }
            }

            if (acceptArray.length === Object.keys(filterObject).length) {
                sortedPieData.push(item);
            }
        }

        this.filteredData = sortedPieData;
    }

    releaseFilter() {
        this.filteredData = this.data;
    }
}
