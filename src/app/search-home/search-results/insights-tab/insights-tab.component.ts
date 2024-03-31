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

  sentimentsData: any;
  sentimentsDataProcessed: any;

  stock1!: StockChart;
  recomData: any;

  stock2!: StockChart;
  earningsData: any;

  constructor(private service: AppServiceService, public searchService: SearchService){}


  ngOnInit() {
    this.getSentimentsData(this.searchService.searchedTicker);

    this.createRecomChart(this.searchService.searchedTicker);

    this.createEarningsChart(this.searchService.searchedTicker);
  }

  //get insider sentiments data
  async getSentimentsData(tickerSymbol: string){
    
    try{
      const data: any = await this.service.getSentiments(tickerSymbol);
      if (data){
        this.sentimentsData = data.data;
        //console.log('insider sentiments data is:', this.sentimentsData);
        
        //processing the Sentiments data
            let totalMSPR = 0;
            let positiveMSPR = 0;
            let negativeMSPR = 0;
            let totalChange = 0;
            let positiveChange = 0;
            let negativeChange = 0;

            this.sentimentsData.forEach((item:any) => {
                // MSPR calculation
                totalMSPR += item.mspr;
                if (item.mspr > 0) {
                    positiveMSPR += item.mspr;
                } else if (item.mspr < 0) {
                    negativeMSPR += item.mspr;
                }

                // Change Calculation
                totalChange += item.change;
                if (item.change > 0) {
                    positiveChange += item.change;
                } else if (item.change < 0) {
                    negativeChange += item.change;
                }
            });

            this.sentimentsDataProcessed = {
              totalMSPR: totalMSPR,
              positiveMSPR: positiveMSPR,
              negativeMSPR: negativeMSPR,
              totalChange: totalChange,
              positiveChange: positiveChange,
              negativeChange: negativeChange
          };
          //console.log('processed sentiment data is', this.sentimentsDataProcessed);
      }
    }
    catch(error){
      //console.log('Error fetching insdier sentiments data',error);
    }
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
      //console.error('Error fetching recommendations data:', error);
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
      return item.period.substring(0, 7); // Extract YYYY-MM part
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
          stacking: 'normal', 
          dataLabels: {
            enabled: true,
            inside: true, 
            formatter: function () {
                return this.y; 
            },
            style: {
                fontWeight: 'bold',
                color: 'white'
            }
          }
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
      type: 'spline',
      name: 'Actual',
      data: actualData,
      marker: {
        enabled: true,
        symbol: 'circle', 
        radius: 4
      }
    },{
      type: 'spline',
      name: 'Estimate',
      data: estimateData,
      marker: {
        enabled: true,
        symbol: 'circle', 
        radius: 4
      }
    }
  ],
  legend: {
    enabled: true
  }
  });

}

}
  
  
