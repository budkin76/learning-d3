import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-d3-sandbox',
    templateUrl: './d3-sandbox.component.html',
    styleUrls: ['./d3-sandbox.component.scss']
})
export class D3SandboxComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        const svg = d3
            .select('#chart-area')
            .append('svg')
            .attr('width', 400)
            .attr('height', 400);

        const circle = svg
            .append('circle')
            .attr('cx', 100)
            .attr('cy', 250)
            .attr('r', 70)
            .attr('fill', 'grey');

        const rectangle = svg
            .append('rect')
            .attr('width', 300)
            .attr('x', 50)
            .attr('y', 100)
            .attr('height', 100)
            .attr('fill', 'red');
    }
}
