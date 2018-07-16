import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-d3-sandbox',
    templateUrl: './d3-sandbox.component.html',
    styleUrls: ['./d3-sandbox.component.scss']
})
export class D3SandboxComponent implements OnInit {
    // data = [25, 20, 10, 12, 15];
    data: Array<any>;
    svg: any;
    circles: any;

    constructor() {}

    ngOnInit() {
        d3.json('../../../assets/data/ages.json')
            .then((data: Array<any>) => {
                this.data = data;
                for (const entry of this.data) {
                    entry.age = +entry.age;
                }
                console.log(this.data);

                this.svg = d3
                    .select('#chart-area')
                    .append('svg')
                    .attr('width', 400)
                    .attr('height', 400);

                this.circles = this.svg.selectAll('circle').data(this.data);

                this.circles
                    .enter()
                    .append('circle')
                    .attr('cx', (d, i) => {
                        return i * 50 + 25;
                    })
                    .attr('cy', 25)
                    .attr('r', d => {
                        return d.age * 2;
                    })
                    .attr('fill', d => {
                        if (d.name === 'Tony') {
                            return 'blue';
                        } else {
                            return 'red';
                        }
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
