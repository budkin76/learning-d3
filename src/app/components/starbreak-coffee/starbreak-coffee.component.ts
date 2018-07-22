import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-starbreak-coffee',
    templateUrl: './starbreak-coffee.component.html',
    styleUrls: ['./starbreak-coffee.component.scss']
})
export class StarbreakCoffeeComponent implements OnInit {
    data: Array<any>;
    svg: any;
    colorRect: any;
    rectangles: any;
    x: any;
    y: any;
    margin: any;
    width: number;
    height: number;
    g: any;
    xAxisGroup: any;
    yAxisGroup: any;
    xAxisCall: any;
    yAxisCall: any;

    constructor() {}

    ngOnInit() {
        d3.json('../../../assets/data/revenues.json')
            .then((data: Array<any>) => {
                this.data = data;
                for (const entry of this.data) {
                    entry.revenue = +entry.revenue;
                }
                console.log(this.data);

                // SVG margins to make space for x and y axis
                this.margin = { top: 50, right: 20, bottom: 100, left: 80 };
                this.width = 600 - this.margin.left - this.margin.right;
                this.height = 400 - this.margin.top - this.margin.bottom;

                // Main SVG
                this.svg = d3
                    .select('#chart-area')
                    .append('svg')
                    .attr(
                        'width',
                        this.width + this.margin.left + this.margin.right
                    )
                    .attr(
                        'height',
                        this.height + this.margin.top + this.margin.bottom
                    );

                // Band scale for x
                this.x = d3
                    .scaleBand()
                    .range([0, this.width])
                    .padding(0.2);

                // Linear scale for y
                this.y = d3.scaleLinear().range([this.height, 0]);

                // Uncomment to see svg background color
                // this.colorRect = this.svg
                //     .append('rect')
                //     .attr('width', '100%')
                //     .attr('height', '100%')
                //     .attr('fill', 'red');

                // Transform (translate) group
                this.g = this.svg
                    .append('g')
                    .attr(
                        'transform',
                        'translate(' +
                            this.margin.left +
                            ', ' +
                            this.margin.top +
                            ')'
                    );

                // X axis group
                this.xAxisGroup = this.g
                    .append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', 'translate(0,' + this.height + ')');

                // Y axis group
                this.yAxisGroup = this.g.append('g').attr('class', 'y-axis');

                // X-axis label
                this.g
                    .append('text')
                    .attr('class', 'x axis-label')
                    .attr('x', this.width / 2)
                    .attr('y', this.height + 50)
                    .attr('font-size', '20px')
                    .attr('text-anchor', 'middle')
                    .text('Month');

                // Y-axis label
                this.g
                    .append('text')
                    .attr('class', 'y axis-label')
                    .attr('x', -(this.height / 2))
                    .attr('y', -60)
                    .attr('font-size', '20px')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .text('Revenue');

                d3.interval(() => {
                    this.update(this.data);
                }, 1000);

                // Run visualization for first time
                this.update(this.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    private update(data: Array<any>): void {
        // X domain
        this.x.domain(
            data.map(d => {
                return d.month;
            })
        );

        // Y domain
        this.y.domain([
            0,
            d3.max(data, d => {
                return d.revenue;
            })
        ]);

        // X-axis
        this.xAxisCall = d3.axisBottom(this.x);
        this.xAxisGroup.call(this.xAxisCall);

        // Y-axis
        this.yAxisCall = d3
            .axisLeft(this.y)
            .ticks(10)
            .tickFormat(d => {
                return '$' + d;
            });
        this.yAxisGroup.call(this.yAxisCall);

        // Bars

        // JOIN new data with old elements
        this.rectangles = this.g.selectAll('rect').data(this.data);

        // EXIT old elements not present in new data
        this.rectangles.exit().remove();

        // UPDATE old elements present in new data
        this.rectangles
            .attr('y', d => {
                return this.y(d.revenue);
            })
            .attr('x', d => {
                return this.x(d.month);
            })
            .attr('height', d => {
                return this.height - this.y(d.revenue);
            })
            .attr('width', this.x.bandwidth);

        // ENTER new elements present in new data
        this.rectangles
            .enter()
            .append('rect')
            .attr('y', d => {
                return this.y(d.revenue);
            })
            .attr('x', d => {
                return this.x(d.month);
            })
            .attr('height', d => {
                return this.height - this.y(d.revenue);
            })
            .attr('width', this.x.bandwidth)
            .attr('fill', 'grey');
    }
}
