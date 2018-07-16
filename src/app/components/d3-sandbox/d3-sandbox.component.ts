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
    rectangles: any;
    y: any;

    constructor() {}

    ngOnInit() {
        d3.json('../../../assets/data/buildings.json')
            .then((data: Array<any>) => {
                this.data = data;
                for (const entry of this.data) {
                    entry.height = +entry.height;
                }
                console.log(this.data);

                this.svg = d3
                    .select('#chart-area')
                    .append('svg')
                    .attr('width', 400)
                    .attr('height', 400);

                this.y = d3
                    .scaleLinear()
                    .domain([0, 828])
                    .range([0, 400]);

                this.rectangles = this.svg
                    .selectAll('rect')
                    .data(this.data)
                    .enter()
                    .append('rect')
                    .attr('x', (d, i) => {
                        return i * 60;
                    })
                    .attr('y', 20)
                    .attr('width', 40)
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
