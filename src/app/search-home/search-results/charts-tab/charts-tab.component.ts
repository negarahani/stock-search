import { Component } from '@angular/core';

import * as Highcharts from 'highcharts/highstock';
import { StockChart } from 'angular-highcharts';

//import IndicatorsCore from "highcharts/indicators/indicators"
import indicators from 'highcharts/indicators/indicators';
import volumeByPrice from 'highcharts/indicators/volume-by-price';

import { AppServiceService } from '../../../app-service.service';
import { SearchService } from '../../../search.service';




//IndicatorsCore(Highcharts);
indicators(Highcharts);
volumeByPrice(Highcharts);
console.log('line 16');



@Component({
  selector: 'app-charts-tab',
  templateUrl: './charts-tab.component.html',
  styleUrl: './charts-tab.component.css'
})

export class ChartsTabComponent {

  stock!: StockChart;
  Highcharts: typeof Highcharts = Highcharts;
  resultsData: any;

  constructor(private service: AppServiceService, private searchService: SearchService){}

  ngOnInit(){

    //console.log('in chart component the searchedTicker is:',this.searchService.searchedTicker);
    this.createChart(this.searchService.searchedTicker);

  }

  async getHistoricalChartData(tickerSymbol: string){
    
    let data = await this.service.getHistoricalChart(tickerSymbol);
    //.log('result is:', data);
    if (data){
      this.resultsData = (data as { results: any }).results;
    }
    //console.log('resultsData is:',this.resultsData);
  }
  
  async createChart(ticker: string) {
    await this.getHistoricalChartData(ticker);
   
    

    // Initialize arrays for OHLC and volume
    const ohlc : any[] = [];
    const volume: any[] = [];

    // Iterate over the data to populate OHLC and volume arrays
    this.resultsData.forEach((item: any) => {
      ohlc.push([
        item.t, // the date
        item.o, // open
        item.h, // high
        item.l, // low
        item.c // close
      ]);

    volume.push([
      item.t, // the date
      item.v // the volume
    ]);
  });


  this.stock = new StockChart({
    chart:{
      backgroundColor: '#F5F5F5'
    },
    rangeSelector: {
      selected: 2
    },
    title: {
      text: `${this.searchService.searchedTicker} Historical`
    },

    subtitle: {
      text: 'With SMA and Volume by Price technical indicators'
    },
    yAxis: [{
      startOnTick: false,
      endOnTick: false,
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
          enabled: true
      }
  }, {
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
  }],
  tooltip: {
    split: true
  },
  plotOptions: {
    series: {
        dataGrouping: {
           units: [[
            'week',                        
            [1]                             
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]]
        }
    }
  },
  series: [{
    type: 'candlestick',
    name: `${this.searchService.searchedTicker}`,
    id: `${this.searchService.searchedTicker}`,
    zIndex: 2,
    data: ohlc
}, {
    type: 'column',
    name: 'Volume',
    id: 'volume',
    data: volume,
    yAxis: 1
  }, {
    type: 'vbp',
    linkedTo: `${this.searchService.searchedTicker}`,
    params: {
        volumeSeriesID: 'volume'
    },
    dataLabels: {
        enabled: false
    },
    zoneLines: {
        enabled: false
    }
    }, {
    type: 'sma',
    linkedTo: `${this.searchService.searchedTicker}`,
    zIndex: 1,
    marker: {
        enabled: false
    }
  }]
  });

  }
  
}
