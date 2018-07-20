import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-d3-sandbox',
    templateUrl: './d3-sandbox.component.html',
    styleUrls: ['./d3-sandbox.component.scss']
})
export class D3SandboxComponent implements OnInit {
    data: Array<any>;
    svg: any;
    colorRect: any;
    rectangles: any;
    x: any;
    y: any;
    margin = { top: 10, right: 10, bottom: 150, left: 100 };
    width: number;
    height: number;
    g: any;
    xAxisCall: any;
    yAxisCall: any;

    constructor() {}

    ngOnInit() {
        d3.json('../../../assets/data/buildings.json')
            .then((data: Array<any>) => {
                this.data = data;
                for (const entry of this.data) {
                    entry.height = +entry.height;
                }
                console.log(this.data);

                this.width = 600 - this.margin.left - this.margin.right;
                this.height = 400 - this.margin.top - this.margin.bottom;

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

                // uncomment to see svg background color
                // this.colorRect = this.svg
                //     .append('rect')
                //     .attr('width', '100%')
                //     .attr('height', '100%')
                //     .attr('fill', 'red');

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

                this.g
                    .append('text')
                    .attr('class', 'x axis-label')
                    .attr('x', this.width / 2)
                    .attr('y', this.height + 140)
                    .attr('font-size', '20px')
                    .attr('text-anchor', 'middle')
                    .text('The worlds tallest buildings');

                this.g
                    .append('text')
                    .attr('class', 'y axis-label')
                    .attr('x', -(this.height / 2))
                    .attr('y', -60)
                    .attr('font-size', '20px')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .text('Height (m)');

                this.x = d3
                    .scaleBand()
                    .domain(
                        this.data.map(d => {
                            return d.name;
                        })
                    )
                    .range([0, this.width])
                    .paddingInner(0.3)
                    .paddingOuter(0.3);

                this.y = d3
                    .scaleLinear()
                    .domain([
                        0,
                        d3.max(this.data, d => {
                            return d.height;
                        })
                    ])
                    .range([0, this.height]);

                this.xAxisCall = d3.axisBottom(this.x);

                this.g
                    .append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', 'translate(0,' + this.height + ')')
                    .call(this.xAxisCall)
                    .selectAll('text')
                    .attr('y', '10')
                    .attr('x', '-5')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'rotate(-40)');

                this.yAxisCall = d3
                    .axisLeft(this.y)
                    .ticks(3)
                    .tickFormat(d => {
                        return d + 'm';
                    });

                this.g
                    .append('g')
                    .attr('class', 'y-axis')
                    .call(this.yAxisCall);

                this.rectangles = this.g
                    .selectAll('rect')
                    .data(this.data)
                    .enter()
                    .append('rect')
                    .attr('y', 0)
                    .attr('x', d => {
                        return this.x(d.name);
                    })
                    .attr('width', this.x.bandwidth)
                    .attr('height', d => {
                        return this.y(d.height);
                    })
                    .attr('fill', 'grey');
            })
            .catch(error => {
                console.log(error);
            });
    }
}
