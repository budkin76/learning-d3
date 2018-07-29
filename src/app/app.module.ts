import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { D3SandboxComponent } from './components/d3-sandbox/d3-sandbox.component';
import { GapminderCloneComponent } from './components/gapminder-clone/gapminder-clone.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { StarbreakCoffeeComponent } from './components/starbreak-coffee/starbreak-coffee.component';

@NgModule({
    declarations: [
        AppComponent,
        D3SandboxComponent,
        StarbreakCoffeeComponent,
        GapminderCloneComponent,
        LineGraphComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatIconModule,
        MatListModule,
        MatCardModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
