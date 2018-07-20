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
    margin = { top: 10, right: 10, bottom: 100, left: 100 };
    width: number;
    height: number;
    g: any;

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

                this.rectangles = this.g
                    .selectAll('rect')
                    .data(this.data)
                    .enter()
                    .append('rect')
                    .attr('x', d => {
                        return this.x(d.name);
                    })
                    .attr('y', 20)
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
