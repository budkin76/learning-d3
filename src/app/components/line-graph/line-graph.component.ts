import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-graph',
    templateUrl: './line-graph.component.html',
    styleUrls: ['./line-graph.component.scss']
})
export class LineGraphComponent implements OnInit {
    margin: any;
    width: number;
    height: number;
    svg: any;
    g: any;
    parseTime: any;
    bisectDate: any;
    x: any;
    y: any;
    xAxisCall: any;
    yAxisCall: any;
    xAxis: any;
    yAxis: any;
    line: any;
    focus: any;
    componentData: Array<any>;

    constructor() {}

    ngOnInit() {
        // SVG margins to make space for x and y axis
        this.margin = { top: 50, right: 100, bottom: 100, left: 80 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.svg = d3
            .select('#chart-area')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        this.g = this.svg
            .append('g')
            .attr(
                'transform',
                'translate(' + this.margin.left + ', ' + this.margin.top + ')'
            );

        // Time parser for x-scale
        this.parseTime = d3.timeParse('%Y');
        // For tooltip
        this.bisectDate = d3.bisector((d: any) => {
            return d.year;
        }).left;

        // Scales
        this.x = d3.scaleTime().range([0, this.width]);
        this.y = d3.scaleLinear().range([this.height, 0]);

        // Axis generators
        this.xAxisCall = d3.axisBottom(this.x);
        this.yAxisCall = d3
            .axisLeft(this.y)
            .ticks(6)
            .tickFormat((d: any) => {
                return d / 1000 + 'k';
            });

        // Axis groups
        this.xAxis = this.g
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + this.height + ')');
        this.yAxis = this.g.append('g').attr('class', 'axis');

        // Y-Axis label
        this.yAxis
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .attr('fill', '#5D6971')
            .text('Population)');

        // Line path generator
        this.line = d3
            .line()
            .x((d: any) => {
                return this.x(d['year']);
            })
            .y(d => {
                return this.y(d['value']);
            });

        d3.json('../../../assets/data/example.json')
            .then((data: Array<any>) => {
                this.componentData = data;

                // Data cleaning
                this.componentData.forEach(d => {
                    d.year = this.parseTime(d.year);
                    d.value = +d.value;
                });

                console.log(this.componentData);

                // Set scale domains
                this.x.domain(
                    d3.extent(this.componentData, function(d) {
                        return d.year;
                    })
                );
                this.y.domain([
                    d3.min(this.componentData, d => {
                        return d.value;
                    }) / 1.005,
                    d3.max(this.componentData, d => {
                        return d.value;
                    }) * 1.005
                ]);

                // Generate axes once scales have been set
                this.xAxis.call(this.xAxisCall.scale(this.x));
                this.yAxis.call(this.yAxisCall.scale(this.y));

                // Add line to chart
                this.g
                    .append('path')
                    .attr('class', 'line')
                    .attr('fill', 'none')
                    .attr('stroke', 'grey')
                    .attr('stroke-width', '3px')
                    .attr('d', this.line(this.componentData));

                // Tooltip

                // Focuser
                this.focus = this.g
                    .append('g')
                    .attr('class', 'focus')
                    .style('display', 'none');
                this.focus
                    .append('line')
                    .attr('class', 'x-hover-line hover-line')
                    .attr('y1', 0)
                    .attr('y2', this.height);
                this.focus
                    .append('line')
                    .attr('class', 'y-hover-line hover-line')
                    .attr('x1', 0)
                    .attr('x2', this.width);
                this.focus.append('circle').attr('r', 7.5);
                this.focus
                    .append('text')
                    .attr('x', 15)
                    .attr('dy', '.31em');

                // Overlay to catch mouse events
                this.g
                    .append('rect')
                    .attr('class', 'overlay')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .on('mouseover', () => {
                        this.mouseover();
                    })
                    .on('mouseout', () => {
                        this.mouseout();
                    })
                    .on('mousemove', () => {
                        this.mousemove();
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    mouseover(): void {
        this.focus.style('display', null);
    }

    mouseout(): void {
        this.focus.style('display', 'none');
    }

    mousemove(): void {
        const x0 = this.x.invert(d3.mouse(d3.event.currentTarget)[0]),
            i = this.bisectDate(this.componentData, x0, 1),
            d0 = this.componentData[i - 1],
            d1 = this.componentData[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        this.focus.attr(
            'transform',
            'translate(' + this.x(d.year) + ',' + this.y(d.value) + ')'
        );
        this.focus.select('text').text(d.value);
        this.focus
            .select('.x-hover-line')
            .attr('y2', this.height - this.y(d.value));
        this.focus.select('.y-hover-line').attr('x2', -this.x(d.year));
    }
}
