import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

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
    tip: any;
    interval: any;
    formattedData: Array<any>;
    playPauseButtonText = 'Play';
    continentSelect = [
        { label: 'All', value: 'all' },
        { label: 'Europe', value: 'europe' },
        { label: 'Asia', value: 'asia' },
        { label: 'Americas', value: 'americas' },
        { label: 'Africa', value: 'africa' }
    ];
    selectedContinent = 'all';
    sliderMax = 2014;
    sliderMin = 1800;
    sliderStep = 1;
    sliderValue: number;

    constructor() {}

    ngOnInit() {
        this.sliderValue = this.sliderMin;
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

        this.tip = d3Tip()
            .attr('class', 'd3-tip')
            .html(d => {
                const tipTemplate =
                    `<div>Country: <strong>` +
                    d.country +
                    `</strong></div>
                <div>Continent: <span style='text-transform: capitalize'><strong>` +
                    d.continent +
                    `</strong></span></div>
                <div>Life Expectancy: <strong>` +
                    d3.format('.2f')(d.life_exp) +
                    `</strong></div>
                <div>GDP Per Capita: <strong>` +
                    d3.format('$,.0f')(d.income) +
                    `</strong></div>
                <div>Population: <strong>` +
                    d3.format(',.0f')(d.population) +
                    `</strong></div>`;
                return tipTemplate;
            });

        this.g.call(this.tip);

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
                this.formattedData = data.map(year => {
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

                // First run of the visualization
                this.update(this.formattedData[0]);
            })
            .catch(error => {
                console.log(error);
            });
    }

    update(data: Array<any>): void {
        // Standard transition time for the visualization
        this.transition = d3.transition().duration(100);

        const updateData = data.filter((d: any) => {
            if (this.selectedContinent === 'all') {
                return d;
            } else {
                return d.continent === this.selectedContinent;
            }
        });

        // JOIN new data with old elements.
        this.circles = this.g.selectAll('circle').data(updateData, d => {
            return d.country;
        });

        // EXIT old elements not present in new data.
        this.circles
            .exit()
            .attr('class', 'exit')
            .remove();

        // ENTER new elements present in new data.
        this.circles
            .enter()
            .append('circle')
            .attr('class', 'enter')
            .attr('fill', d => {
                return this.continentColor(d.continent);
            })
            .on('mouseover', this.tip.show)
            .on('mouseout', this.tip.hide)
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

        // Update the slider
        this.sliderValue = this.time + 1800;
    }

    playPause(): void {
        if (this.playPauseButtonText === 'Play') {
            this.playPauseButtonText = 'Pause';
            this.interval = setInterval(() => {
                // At the end of our data, loop back
                this.time = this.time < 214 ? this.time + 1 : 0;
                this.update(this.formattedData[this.time]);
            }, 100);
        } else {
            this.playPauseButtonText = 'Play';
            clearInterval(this.interval);
        }
    }

    reset(): void {
        this.time = 0;
        this.update(this.formattedData[0]);
    }

    onSelectContinent(): void {
        this.update(this.formattedData[this.time]);
    }

    onSliderChange(event): void {
        this.time = this.sliderValue - 1800;
        this.update(this.formattedData[this.time]);
    }
}
