import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';



import { AppRoutingModule } from './app-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';
import {MatButtonModule} from '@angular/material/button';
import { SearchHomeComponent } from './search-home/search-home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchResultsComponent } from './search-home/search-results/search-results.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { ChartsTabComponent } from './search-home/search-results/charts-tab/charts-tab.component';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';



//import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';
import { SummaryTabComponent } from './search-home/search-results/summary-tab/summary-tab.component';
import { InsightsTabComponent } from './search-home/search-results/insights-tab/insights-tab.component';
import { NewsTabComponent } from './search-home/search-results/news-tab/news-tab.component';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [stock, more];
}



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchHomeComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchResultsComponent,
    ChartsTabComponent,
    SummaryTabComponent,
    InsightsTabComponent,
    NewsTabComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    MatTabsModule,
    MatFormFieldModule, 
    MatAutocompleteModule, 
    MatInputModule, 
    MatIconModule,
    MatButtonModule, 
    MatButtonToggleModule,
    MatIconButton,
    MatIcon,
    ChartModule,
    HighchartsChartModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    DatePipe,
   { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
