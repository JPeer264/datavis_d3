import d3 = require('d3');

export class BarChart {
    public _width:number;
    public _height:number;

    constructor(public selector: string = 'body', public max_width: number = 200, public max_height: number = 200, public bar_height: number = 50) {
        const data = [4, 200, 15, 23, 42];

        this.update(data);
    }

    public set width(width:number) {
        this._width = width;
    }

    public get width():number {
        return this._width;
    }

    public update(data: Array<number>): void {
        const padding = 5;
        const expand = this.max_width / d3.max(data);

        this._width = d3.max(data) * expand;
        this._height = data.length * (padding + this.bar_height);

        let svg = d3.select(this.selector)
                    .append('svg')
                    .attr('width', this._width)
                    .attr('height', this._height);

        const g = svg.append('g');
        const rect = g.selectAll('rect').data(data);
        const rect_enter = rect.enter().append('rect').attr('x', 0);

        rect.merge(rect_enter)
            .attr('height', this.bar_height)
            .attr('width', d => d * expand)
            .attr('y', (d, i) => i * (this.bar_height + padding));

        rect.exit().remove();
    }
}
