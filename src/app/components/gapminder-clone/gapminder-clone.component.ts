import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-gapminder-clone',
    templateUrl: './gapminder-clone.component.html',
    styleUrls: ['./gapminder-clone.component.scss']
})
export class GapminderCloneComponent implements OnInit {
    margin: any;
    width: number;
    height: number;
    g: any;
    transition: any;
    xAxisGroup: any;
    yAxisGroup: any;
    x: any;
    y: any;
    xAxisCall: any;
    yAxisCall: any;
    circles: any;
    time = 0;

    constructor() {}

    ngOnInit() {
        // SVG margins to make space for x and y axis
        this.margin = { top: 50, right: 20, bottom: 100, left: 80 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

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

        // Logarithmic scale for x
        this.x = d3
            .scaleLog()
            .base(10)
            .range([0, this.width])
            .domain([300, 150000]);

        // Linear scale for y
        this.y = d3
            .scaleLinear()
            .range([this.height, 0])
            .domain([0, 90]);

        // X-axis label
        this.g
            .append('text')

            .attr('x', this.width / 2)
            .attr('y', this.height + 50)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('GDP-per-capita');

        // Y-axis label
        this.g
            .append('text')

            .attr('x', -(this.height / 2))
            .attr('y', -60)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Life expectancy');

        d3.json('../../../assets/data/data.json')
            .then((data: Array<any>) => {
                // Just take the first year
                const firstYearData = data[0];

                const firstYearDataFiltered = firstYearData.countries.filter(
                    country => {
                        return country.income && country.life_exp;
                    }
                );

                console.log(firstYearDataFiltered);

                d3.interval(() => {
                    this.update(firstYearDataFiltered);
                }, 1000);
            })
            .catch(error => {
                console.log(error);
            });
    }

    private update(updateData: Array<any>): void {
        // X-axis
        this.xAxisCall = d3.axisBottom(this.x).tickValues([400, 4000, 40000]);
        this.xAxisGroup.transition(this.transition).call(this.xAxisCall);

        // Y-axis
        this.yAxisCall = d3.axisLeft(this.y);
        this.yAxisGroup.transition(this.transition).call(this.yAxisCall);

        // Circles

        // JOIN new data with old elements
        this.circles = this.g.selectAll('circle').data(updateData, d => {
            return d.income;
        });

        // EXIT old elements not present in new data
        this.circles.exit().remove();

        // ENTER new elements present in new data
        this.circles
            .enter()
            .append('circle')
            .attr('fill', 'grey')
            .attr('cy', this.y(0))
            .attr('cx', d => {
                return this.x(d.income);
            })
            .attr('r', 5)
            // AND UPDATE old elements present in new data
            .merge(this.circles)
            .attr('cx', d => {
                return this.x(d.income);
            })
            .attr('cy', d => {
                return this.y(d.life_exp);
            });
    }
}
