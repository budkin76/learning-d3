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
            .attr('cx', 200)
            .attr('cy', 200)
            .attr('r', 100)
            .attr('fill', 'blue');
    }
}
