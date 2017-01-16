import d3 = require('d3');

export class ChartManager {
    public data: Array<Object>;
    public charts: Array<any> = [];
    public unlinkedCharts: Array<any> = [];
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
        for (let chart of this.charts) {
            chart.update(this.filteredData);
        }
    }

    updateUnlinkedCharts(): void {
        // update piecharts
        for (let chart of this.unlinkedCharts) {
            chart.update(this.data);
        }
    }

    addChart(...charts): void {
        this.charts = this.charts.concat(charts)
    }

    /**
     * if you set any charts here,
     * make sure the [chart].options.unlinked is set to true
     *
     * example:
     *     new Barchart({
     *         unlinked: true
     *     });
     */
    addUnlinkedChart(...charts): void {
        this.unlinkedCharts = this.unlinkedCharts.concat(charts)
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
