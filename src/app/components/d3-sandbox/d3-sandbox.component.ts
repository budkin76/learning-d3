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

                this.rectangles = this.svg.selectAll('rect').data(this.data);

                this.rectangles
                    .enter()
                    .append('rect')
                    .attr('x', (d, i) => {
                        return i * 50;
                    })
                    .attr('y', d => {
                        return 10;
                    })
                    .attr('width', d => {
                        return 25;
                    })
                    .attr('height', d => {
                        return d.height;
                    })
                    .attr('fill', 'grey');
            })
            .catch(error => {
                console.log(error);
            });
    }
}
