import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-d3-sandbox',
    templateUrl: './d3-sandbox.component.html',
    styleUrls: ['./d3-sandbox.component.scss']
})
export class D3SandboxComponent implements OnInit {
    data = [25, 20, 10, 12, 15];

    constructor() {}

    ngOnInit() {
        const svg = d3
            .select('#chart-area')
            .append('svg')
            .attr('width', 400)
            .attr('height', 400);

        const circles = svg.selectAll('circle').data(this.data);

        circles
            .enter()
            .append('circle')
            .attr('cx', (d, i) => {
                return i * 50 + 25;
            })
            .attr('cy', 25)
            .attr('r', d => {
                return d;
            })
            .attr('fill', 'red');
    }
}
