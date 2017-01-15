import d3 = require('d3');

export class ChartManager {
    public data: Array<Object>;
    public pieCharts: Array<any> = [];
    public barCharts: Array<any> = [];
    public filteredData: Array<Object>;

    constructor(private csvFile: String) {}

    render(cb: Function): void {
        d3.csv(this.csvFile, (err, data) => {
           this.data = this.filteredData = data;

           cb(err, {
               data
           });
        });
    }

    updateCharts(): void {
        // update piecharts
        for (let pieChart of this.pieCharts) {
            pieChart.update(this.filteredData);
        }

        // update piecharts
        for (let barChart of this.barCharts) {
            barChart.update(this.filteredData);
        }
    }

    addPieChart(...charts): void {
        this.pieCharts = this.pieCharts.concat(charts)
    }

    addBarChart(...charts): void {
        this.barCharts = this.barCharts.concat(charts)
    }

    filterData(filterObject): void {
        const sortedData: Array<Object> = [];

        // sort pieData
        for (let item of this.data) {
            let acceptArray = [];

            for (let filterOption in filterObject) {
                if (item[filterOption] === filterObject[filterOption]) {
                    acceptArray.push(true);
                }
            }

            if (acceptArray.length === Object.keys(filterObject).length) {
                sortedData.push(item);
            }
        }

        this.filteredData = sortedData;
    }

    releaseFilter(): void {
        this.filteredData = this.data;
    }
}
