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
    area: any;
    continentColor: any;
    xLabel: any;
    yLabel: any;
    timeLabel: any;
    continents: Array<any>;
    legend: any;
    legendRow: any;

    constructor() {}

    ngOnInit() {
        // SVG margins to make space for x and y axis
        this.margin = { top: 50, right: 20, bottom: 100, left: 80 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

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

        // Scales
        this.x = d3
            .scaleLog()
            .base(10)
            .range([0, this.width])
            .domain([142, 150000]);
        this.y = d3
            .scaleLinear()
            .range([this.height, 0])
            .domain([0, 90]);
        this.area = d3
            .scaleLinear()
            .range([25 * Math.PI, 1500 * Math.PI])
            .domain([2000, 1400000000]);
        this.continentColor = d3.scaleOrdinal(d3.schemePastel1);

        // Labels
        this.xLabel = this.g
            .append('text')
            .attr('y', this.height + 50)
            .attr('x', this.width / 2)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('GDP Per Capita ($)');
        this.yLabel = this.g
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -170)
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .text('Life Expectancy (Years)');
        this.timeLabel = this.g
            .append('text')
            .attr('y', this.height - 10)
            .attr('x', this.width - 40)
            .attr('font-size', '40px')
            .attr('opacity', '0.4')
            .attr('text-anchor', 'middle')
            .text('1800');

        // X Axis
        this.xAxisCall = d3
            .axisBottom(this.x)
            .tickValues([400, 4000, 40000])
            .tickFormat(d3.format('$'));
        this.g
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxisCall);

        // Y Axis
        this.yAxisCall = d3.axisLeft(this.y);
        this.g
            .append('g')
            .attr('class', 'y axis')
            .call(this.yAxisCall);

        this.continents = ['europe', 'asia', 'americas', 'africa'];

        this.legend = this.g
            .append('g')
            .attr(
                'transform',
                'translate(' +
                    (this.width - 10) +
                    ',' +
                    (this.height - 125) +
                    ')'
            );

        this.continents.forEach((continent, i) => {
            this.legendRow = this.legend
                .append('g')
                .attr('transform', 'translate(0' + ',' + i * 20 + ')');

            this.legendRow
                .append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', this.continentColor(continent));

            this.legendRow
                .append('text')
                .attr('x', -10)
                .attr('y', 10)
                .attr('text-anchor', 'end')
                .style('text-transform', 'capitalize')
                .text(continent);
        });

        d3.json('../../../assets/data/data.json')
            .then((data: Array<any>) => {
                // Clean data
                const formattedData = data.map(function(year) {
                    return year['countries']
                        .filter(country => {
                            const dataExists =
                                country.income && country.life_exp;
                            return dataExists;
                        })
                        .map(country => {
                            country.income = +country.income;
                            country.life_exp = +country.life_exp;
                            return country;
                        });
                });

                // Run the code every 0.1 second
                d3.interval(() => {
                    // At the end of our data, loop back
                    this.time = this.time < 214 ? this.time + 1 : 0;
                    this.update(formattedData[this.time]);
                }, 100);

                // First run of the visualization
                this.update(formattedData[0]);
            })
            .catch(error => {
                console.log(error);
            });
    }

    private update(updateData: Array<any>): void {
        // Standard transition time for the visualization
        this.transition = d3.transition().duration(100);

        // JOIN new data with old elements.
        this.circles = this.g.selectAll('circle').data(updateData, d => {
            return d.country;
        });

        // EXIT old elements not present in new data.
        this.circles
            .exit()
            .attr('class', 'exit')
            .remove();

        this.circles
            .enter()
            .append('circle')
            .attr('class', 'enter')
            .attr('fill', d => {
                return this.continentColor(d.continent);
            })
            .merge(this.circles)
            .transition(this.transition)
            .attr('cy', d => {
                return this.y(d.life_exp);
            })
            .attr('cx', d => {
                return this.x(d.income);
            })
            .attr('r', d => {
                return Math.sqrt(this.area(d.population) / Math.PI);
            });

        // Update the time label
        this.timeLabel.text(+(this.time + 1800));
    }
}
