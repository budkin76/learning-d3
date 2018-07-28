import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { D3SandboxComponent } from './components/d3-sandbox/d3-sandbox.component';
import { StarbreakCoffeeComponent } from './components/starbreak-coffee/starbreak-coffee.component';
import { GapminderCloneComponent } from './components/gapminder-clone/gapminder-clone.component';

@NgModule({
    declarations: [
        AppComponent,
        D3SandboxComponent,
        StarbreakCoffeeComponent,
        GapminderCloneComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSelectModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatCardModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
