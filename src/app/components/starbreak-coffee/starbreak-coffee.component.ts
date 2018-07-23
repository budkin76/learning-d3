import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-starbreak-coffee',
    templateUrl: './starbreak-coffee.component.html',
    styleUrls: ['./starbreak-coffee.component.scss']
})
export class StarbreakCoffeeComponent implements OnInit {
    data: Array<any>;
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
    showRevenue = true;
    yLabel: any;
    transition: any;

    constructor() {}

    ngOnInit() {
        // SVG margins to make space for x and y axis
        this.margin = { top: 50, right: 20, bottom: 100, left: 80 };
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;

        this.transition = d3.transition().duration(750);

        // Main SVG and transform group
        this.g = d3
            .select('#chart-area')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ', ' + this.margin.top + ')'
            );

        // X axis group
        this.xAxisGroup = this.g
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')');

        // Y axis group
        this.yAxisGroup = this.g.append('g').attr('class', 'y axis');

        // Band scale for x
        this.x = d3
            .scaleBand()
            .range([0, this.width])
            .padding(0.2);

        // Linear scale for y
        this.y = d3.scaleLinear().range([this.height, 0]);

        // X-axis label
        this.g
            .append('text')

            .attr('x', this.width / 2)
            .attr('y', this.height + 50)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('Month');

        // Y-axis label
        this.yLabel = this.g
            .append('text')

            .attr('x', -(this.height / 2))
            .attr('y', -60)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Revenue');

        d3.json('../../../assets/data/revenues.json')
            .then((data: Array<any>) => {
                this.data = data;

                // Convert relevant data strings to numbers
                for (const entry of this.data) {
                    entry.revenue = +entry.revenue;
                    entry.profit = +entry.profit;
                }

                d3.interval(() => {
                    const newData = this.showRevenue
                        ? this.data
                        : this.data.slice(1);
                    this.update(newData);
                    this.showRevenue = !this.showRevenue;
                }, 1000);

                // Run visualization for first time
                this.update(this.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    private update(updateData: Array<any>): void {
        const dataValue = this.showRevenue ? 'revenue' : 'profit';

        // X domain
        this.x.domain(
            updateData.map(d => {
                return d.month;
            })
        );

        // Y domain
        this.y.domain([
            0,
            d3.max(updateData, d => {
                return d[dataValue];
            })
        ]);

        // X-axis
        this.xAxisCall = d3.axisBottom(this.x);
        this.xAxisGroup.transition(this.transition).call(this.xAxisCall);

        // Y-axis
        this.yAxisCall = d3
            .axisLeft(this.y)

            .tickFormat(d => {
                return '$' + d;
            });
        this.yAxisGroup.transition(this.transition).call(this.yAxisCall);

        // Bars

        // JOIN new data with old elements
        this.rectangles = this.g.selectAll('circle').data(updateData, d => {
            return d.month;
        });

        // EXIT old elements not present in new data
        this.rectangles
            .exit()
            .attr('fill', 'red')
            .transition(this.transition)
            .attr('cy', this.y(0))
            .remove();

        // ENTER new elements present in new data
        this.rectangles
            .enter()
            .append('circle')
            .attr('fill', 'grey')
            .attr('cy', this.y(0))
            .attr('cx', d => {
                return this.x(d.month) + this.x.bandwidth() / 2;
            })
            .attr('r', 5)
            // AND UPDATE old elements present in new data
            .merge(this.rectangles)
            .transition(this.transition)
            .attr('cx', d => {
                return this.x(d.month) + this.x.bandwidth() / 2;
            })
            .attr('cy', d => {
                return this.y(d[dataValue]);
            });

        // Set y label
        const label = this.showRevenue ? 'Revenue' : 'Profit';
        this.yLabel.text(label);
    }
}
