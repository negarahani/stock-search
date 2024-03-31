import { Component } from '@angular/core';
import { SearchService } from '../../../search.service';
import { DatePipe } from '@angular/common';
import { AppServiceService } from '../../../app-service.service';
import { StockChart } from 'angular-highcharts';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.css'
})
export class SummaryTabComponent {

  peersArray: any[] = [];

  stock!: StockChart;

  fromDateFormatted: any;
  toDateFormatted: any;
  resultsData: any;
  priceArray:any[] = [];

  
  constructor(public searchService: SearchService, private service: AppServiceService, private datePipe: DatePipe){}

  ngOnInit(){


    //console.log('in chart component the searchedTicker is:',this.searchService.searchedTicker);
    this.getCompanyPeersData(this.searchService.searchedTicker);
    this.createChart(this.searchService.searchedTicker);

  }
  
  async getCompanyPeersData(ticker: string){
    let data: any = await this.service.getCompanyPeers(ticker);
    if (data){
      //filter out the ones that have dot in them
      this.peersArray = data.filter((peer: string) => !peer.includes('.'));
      //console.log('peers data is:', this.peersArray);
    }
  }


  async createChart(ticker: string) {
    await this.getHourlyPriceData(ticker);

    let lineColor = '#000000'; // Default color black
    if (this.searchService.quoteData.d > 0) {
      lineColor = '#198754'; 
    } else if (this.searchService.quoteData.d < 0) {
      lineColor = '#dc3545'; 
    }


    this.stock = new StockChart({
      title: {
        text: `${this.searchService.searchedTicker} Hourly Price Variation` 
      },
      rangeSelector: {
        enabled: false 
      },
      navigator: {
        enabled: false 
      },
      chart: {
        backgroundColor: '#F5F5F5'
      },
      series: [{
        type: 'line',
        name: `${this.searchService.searchedTicker}`,
        data: this.priceArray,
        color: lineColor
      }]
    });
  }

  async getHourlyPriceData(ticker: string){

    await this.getQuoteData(ticker);
    
    //console.log('fromDate is', this.fromDateFormatted);
    //console.log('toDate is', this.toDateFormatted);
    
    let data = await this.service.getHourlyPrice(ticker, this.fromDateFormatted, this.toDateFormatted);
    //console.log('hourly price data from service is',data);
    if (data){
      this.resultsData = (data as { results: any }).results;
      //console.log(this.resultsData);
      this.priceArray = this.resultsData.map((point: any) => ([point.t, point.c])); // Create array of tuples
      //console.log('priceArray:', this.priceArray);
    }  
  }

  async getQuoteData(inputValue: string){

    let data = await this.service.getStockQuote(inputValue);
    //console.log('quoteData',data);
    if (data){
      this.searchService.quoteData = data;
    }

    
    //calculate if the market is open or closed
    const lastOpenTime = this.searchService.quoteData.t * 1000; //convert it to miliseconds
    
    const currentTime = Date.now();

    //console.log('******************lastopentime is**********************',lastOpenTime);
    //console.log('*****************current time is***********************',currentTime);

    if ((currentTime - lastOpenTime) > 5 * 60 * 1000) { //in this case market is closed
      const unixTimestamp = this.searchService.quoteData.t;
      const toDate = new Date (unixTimestamp * 1000);
      this.toDateFormatted = this.datePipe.transform(toDate, 'yyyy-MM-dd');

      const fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 1);
      this.fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
      
      this.searchService.isMarketOpen = false; //change the boolean to reflect market closed
      
    } else { //in this case market is open
      const toDate = new Date();
      this.toDateFormatted= this.datePipe.transform(toDate, 'yyyy-MM-dd');

      const fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() -1);
      this.fromDateFormatted = this.datePipe.transform(fromDate, 'yyyy-MM-dd');

      this.searchService.isMarketOpen = true; //change the boolean to reflect market open
    }
    //console.log('fromDate is', this.fromDateFormatted);
    //console.log('toDate is', this.toDateFormatted);
  }


  searchClickedTicker(ticker: string){
    //console.log('peer item was clicked. peer:', ticker);
    this.searchService.sendTickerClicked(ticker);
  }

}
