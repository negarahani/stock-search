import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../../../app-service.service';
import { SearchService } from '../../../search.service';
import { StockChart } from 'angular-highcharts';



@Component({
  selector: 'app-insights-tab',
  templateUrl: './insights-tab.component.html',
  styleUrl: './insights-tab.component.css'
})
export class InsightsTabComponent implements OnInit{

  stock1!: StockChart;
  recomData: any;

  stock2!: StockChart;
  earningsData: any;

  constructor(private service: AppServiceService, private searchService: SearchService){}


  ngOnInit() {
    this.createRecomChart(this.searchService.searchedTicker);

    this.createEarningsChart(this.searchService.searchedTicker);
  }

  //recommendation section
  async getRecommendationsData(tickerSymbol: string){

    try {
      const data = await this.service.getRecommendations(tickerSymbol);
      if (data){
        //console.log('recommendations data is:', data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching recommendations data:', error);
    }
    return null;
  }

  async createRecomChart(ticker: string){
    this.recomData = await this.getRecommendationsData(ticker);

    //preparing the data
    if (this.recomData) {
      //console.log('Recommendations data received:', this.recomData);
    }
    
    const categories: string[] = this.recomData.map((item: any) => {
      //console.log('Period:', item.period); // Print the value of item.period
      return item.period;
    });
    
    const series =  [
      { name: 'Strong Buy', data: this.recomData.map((item:any) => item.strongBuy) , color:'#004d00'},
      { name: 'Buy', data: this.recomData.map((item:any) => item.buy) , color:'#00cc66'},
      { name: 'Hold', data: this.recomData.map((item:any) => item.hold) , color:'#b37700'},
      { name: 'Sell', data: this.recomData.map((item:any) => item.sell) , color: '#ff6666'},
      { name: 'Strong Sell', data: this.recomData.map((item:any) => item.strongSell), color: '#800000' }
    ];

    //console.log('categories',categories);
    //console.log('series',series);


    this.stock1 = new StockChart({
      chart: {
        type: 'column',
        backgroundColor: '#F5F5F5'
      },
      title: {
        text: 'Recommendation Trends'
      },
      rangeSelector: {
        enabled: false 
      },
      navigator: {
        enabled: false 
      },
      xAxis: {
        type: 'category',
        categories: categories,
        labels: {
          formatter: function () {
            const index = this.value as number; 
            return categories[index]; 
          }
        }
      },
      yAxis: {
        title: {
          text: '#Analysis'
        },
        opposite: false
      },
      legend: { 
        enabled: true, 
        layout: 'horizontal', 
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0 
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      scrollbar: {
        enabled: false 
      },
      series: series as Highcharts.SeriesOptionsType[]
  });
}

//Earnings Section
async getEarningsData(tickerSymbol: string){
  try {
    const data = await this.service.getEarnings(tickerSymbol);
    if (data){
      //console.log('earnings data is:', data);
      return data;
    }
  } catch (error) {
    console.error('Error fetching recommendations data:', error);
  }
  return null;
}


async createEarningsChart(ticker:string){
  this.earningsData = await this.getEarningsData(ticker);

  //preparing data
  const categories: string[] = [];
  const actualData: number[] = [];
  const estimateData: number[] = [];
  const surpriseData: number[] = [];

  // Prepare data for chart
  this.earningsData.forEach((item: any) => {
    categories.push(item.period);
    //if they are null replace with 0
    actualData.push(item.actual !== null ? item.actual : 0);
    estimateData.push(item.estimate !== null ? item.estimate : 0);
    surpriseData.push(item.surprise);
  });

  this.stock2 = new StockChart({
    title: {
      text: 'Historical EPS Surprises'
    },
    rangeSelector: {
      enabled: false 
    },
    navigator: {
      enabled: false 
    },
    scrollbar: {
      enabled: false 
    },
    chart: {
      backgroundColor: '#F5F5F5',
      marginLeft: 70,
      marginRight: 70,
      
    },
    xAxis:{
      categories: categories,
      labels: {
        useHTML: true,
        formatter: function () {
          const index = this.pos;
          return '<div style="text-align: center;">' + categories[index] + '<br/>Surprise: ' + surpriseData[index] + '</div>';
        }
      }
    },
    yAxis: {
      title: {
        text: 'Quantity EPS'
      },
      opposite: false
    },
    series: [{
      type: 'line',
      name: 'Actual',
      data: actualData
    },{
      type: 'line',
      name: 'Estimate',
      data: estimateData
    }
  ]
  });

}

}
  
  
