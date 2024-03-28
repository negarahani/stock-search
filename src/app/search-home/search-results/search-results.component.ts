import { Component, Input, OnChanges, OnInit, SimpleChanges , EventEmitter } from '@angular/core';
import { SearchService } from '../../search.service';
import { AppServiceService } from '../../app-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'; 
import * as moment from 'moment';



@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent implements OnChanges, OnInit{

  //related to Watchlist
  isInWatchList: boolean = false;
  starFill: string = 'white';
  addedWatchlistAlert: boolean = false;
  removedWatchlistAlert: boolean = false;

  //related to portfolio
  completeArray: any[] = [];
  isInPortfolio: boolean = false;
  portfolioName!: string;
  portfolioCurPrice!: any;
  portfolioCurQuantity: any = 0
  portfolioCurTotalCost: any = 0;

  totalCostToBuy: any = 0;
  quantityToBuy: any = 0;
  buyForm!: FormGroup;
  hideBuyButton: boolean =  true; //I mean disable!
  showBuyError: boolean = false;
  stockBoughtAlert: boolean = false;

  totalCostToSell: any = 0;
  quantityToSell: any = 0;
  sellForm!: FormGroup;
  hideSellButton: boolean = true; //I mean disable!
  showSellError: boolean = false;
  stockSoldAlert: boolean = false;


  constructor(public searchService: SearchService, private service: AppServiceService, private route: ActivatedRoute, private fb: FormBuilder, private datePipe: DatePipe){
  }

  ngOnInit(): void {


    console.log('Search home ->results Iniitalised');
    this.searchService.pathString = this.route.snapshot.routeConfig?.path ?? '';
    console.log('current string path is', this.searchService.pathString);

    //related to Watchlist
    this.fetchFavoriteStocks();
    

    //related to Portfolio
    //initilize the forms
    this.buyForm = this.fb.group({
      value: [0] 
    });
    this.sellForm = this.fb.group({
      value: [0]
    });


    this.searchService.portfolioList = [];
    this.fetchBalanceData();
    this.fetchPortfolioList();
    
  }
  //formatting the unix timestamp given in quoteData
  formatTime(timestamp: number): string {
    return this.datePipe.transform(timestamp * 1000, 'yyyy-MM-dd HH:mm:ss') ?? ''; //first we need to convert to miliseconds (*1000)
    //the above gives time in my local time zone(PST)
  }

  // Function to convert local date to UTC
  convertLocalToUTC(date: Date): Date {
    return moment.utc(date).toDate();
  }

  // Function to determine if market is open
isMarketOpen(timestamp: number): boolean {
  const lastOpenTimeUTC = new Date(timestamp * 1000); // timestamp from API is already in UTC
  const currentTimeUTC = this.convertLocalToUTC(new Date()); // Convert current local time to UTC
  const fiveMinutesInMilliseconds = 5 * 60 * 1000;

  // Calculate the time difference in milliseconds
  const timeDifference = currentTimeUTC.getTime() - lastOpenTimeUTC.getTime();

  // Check if the time difference is greater than 5 minutes (300,000 milliseconds)
  if (timeDifference > fiveMinutesInMilliseconds) {
    // Market is closed
    return false;
  } else {
    // Market is open
    return true;
  }
}

  /****************  Related to Watchlist   *******************/
  fetchFavoriteStocks(){
    // Subscribe to getFavoriteStocks here
    this.service.getFavoriteStocks().subscribe(
      (data: any) => {
        console.log('subscribed to getFavoriteStocks');
          this.searchService.favoriteStocks = data;
          console.log('searched ticker is:', this.searchService.searchedTicker);
          console.log('favoritestocks is:', this.searchService.favoriteStocks);
          this.searchService.favoriteStocks.forEach(item => {
          if (item.tickerSymbol == this.searchService.searchedTicker){
            this.isInWatchList = true;
          }
          if (this.isInWatchList){
            this.starFill = 'yellow';
          }
        });
        console.log('isinwatchlist value is:', this.isInWatchList);
          
      },
      (error: any) => {
          console.error('Error fetching favorite stocks:', error);
      }
  );
  }

  toggleSelect() {

    if (!this.isInWatchList){
      // call the appservice to add new favorite
      if (this.searchService.responseData) {
        this.service.addFavoriteStock(this.searchService.responseData.ticker, this.searchService.responseData.name).subscribe(
          response => {
            //console.log('Favorite stock added successfully:', response);
            this.isInWatchList = true;
            this.addedWatchlistAlert = true;

            //after five seconds close the alert
            setTimeout(() => {
              this.addedWatchlistAlert = false;
            }, 5000); 
            
          },
          error => {
            console.error('Error adding favorite stock:', error);
          }
        );
      }
    } else {
      // call the appservice to delete the current favorite ticker
      if (this.searchService.responseData) {
        this.service.deleteFavoriteStock(this.searchService.responseData.ticker).subscribe(
          response => {
            //console.log('Favorite stock removed successfully:', response);
            this.isInWatchList = false;
            this.removedWatchlistAlert = true;

            //after five seconds close the alert
            setTimeout(() => {
              this.removedWatchlistAlert = false;
            }, 5000); 

          },
          error => {
            console.error('Error removing favorite stock:', error);
          }
        );
      }
    }

    this.starFill = this.starFill == 'yellow' ? 'white' : 'yellow'; //toggle the value of starFill between white and yellow
  }

  
  /****************  Related to Portfolio   *******************/
  async fetchBalanceData() {
    let data: any = await this.service.getBalanceData();
    if (data.length > 0) { // Check if data array is not empty
      this.searchService.cashBalance = data[0].cash_balance;
      //console.log('Cash balance is:', this.searchService.cashBalance);
    } else {
      console.log('No balance data found.');
    }
  }

  
  async fetchPortfolioList(){

    this.isInPortfolio = false; //reset this value

    let data = await this.service.getPortfolio();
    //console.log(data);
    if (data){
      this.searchService.portfolioList = data;
    }
    if (this.searchService.portfolioList && Object.keys(this.searchService.portfolioList).length > 0){
      this.searchService.portfolioList.forEach(item => {
        if (item.ticker == this.searchService.searchedTicker ){
          this.isInPortfolio = true;
          this.portfolioCurQuantity = item.quantity; //if item was in the portfolio we need to update these values for our portfolio update later
          this.portfolioCurTotalCost = item.total_cost;
        }
    });
    console.log('portfoliolist is:', this.searchService.portfolioList);
    console.log('isinportfolio value is:', this.isInPortfolio);
    }
  }

  //fetching the company name and current price (to becuase we need to use updatePortfolio)
  async fetchPortfolioData(){

    let companyData: any = await this.service.getData2(this.searchService.searchedTicker);
    let quoteData: any = await this.service.getStockQuote2(this.searchService.searchedTicker);
    this.portfolioCurPrice = quoteData.c;
    this.portfolioName = companyData.name;
    console.log('companyData in fetchporfoliodata is:', companyData);
  }
  
  async buyStock(){

    await this.fetchPortfolioData(); //so that we get the latest current price of the stock before buy/sell

    //reset these values
    this.buyForm.get('value')?.reset(0);
    this.totalCostToBuy = 0;
    this. quantityToBuy = 0;


    const valueControl = this.buyForm.get('value');
    
    
    if (valueControl) {
      // Subscribe to value changes of the input
      valueControl.valueChanges.subscribe(value => {
          this.quantityToBuy = value;
          this.totalCostToBuy = value * this.portfolioCurPrice;
          //console.log('Entered value:', value); 
          //console.log('totalcosttobuy',this.totalCostToBuy);
          //console.log('cash balance', this.searchService.cashBalance)
          if (this.quantityToBuy < 1 || this.totalCostToBuy > this.searchService.cashBalance) {
            this.hideBuyButton = true;
          } else {
            this.hideBuyButton = false;
          }

          if (this.totalCostToBuy > this.searchService.cashBalance) {
            this.showBuyError = true;
            
          } else {
            this.showBuyError = false;
          }
          //console.log('showbuyerror', this.showBuyError);
           
      });
  } else {
    console.error('Form control not found');
  }
  
  }

  async finalBuy(){

    let finalQuantityToBuy = this.portfolioCurQuantity + this.quantityToBuy;
    let finalTotalCost = this.portfolioCurTotalCost + this.totalCostToBuy; 
    await this.service.updatePortfolioItem(this.searchService.searchedTicker, this.portfolioName, finalQuantityToBuy , finalTotalCost);
    
    this.searchService.cashBalance = this.searchService.cashBalance - this.totalCostToBuy;
    await this.service.updateBalanceData(this.searchService.cashBalance);

    await this.fetchPortfolioList(); //to update the buy/sell button appearance
    
    this.stockBoughtAlert = true;
    setTimeout(() => {
      this.stockBoughtAlert = false;
    }, 5000); 
    // await this.fetchBalanceData(); why would I do it?
    
}

  async sellStock(){

    await this.fetchPortfolioData(); //so that we get the latest current price of the stock before buy/sell

    //reset these values
    this.sellForm.get('value')?.reset(0);
    this.totalCostToSell = 0;
    this. quantityToSell = 0;


    const valueControl = this.sellForm.get('value');
    
    
    if (valueControl) {
      // Subscribe to value changes of the input
      valueControl.valueChanges.subscribe(value => {
          this.quantityToSell = value;
          this.totalCostToSell = value * this.portfolioCurPrice;
          //console.log('Entered value:', value); 
          //console.log('totalcosttosell',this.totalCostToSell);
          //console.log('cash balance', this.searchService.cashBalance)
          if (this.quantityToSell < 1 || this.quantityToSell > this.portfolioCurQuantity) {
            this.hideSellButton = true;
          } else {
            this.hideSellButton = false;
          }

          if (this.quantityToSell > this.portfolioCurQuantity) {
            this.showSellError = true;
            
          } else {
            this.showSellError = false;
          }
          //console.log('showsellerror', this.showSellError);
          
      });
  } else {
    console.error('Form control not found');
  }
  }

  async finalSell(){

    let finalQuantityToSell = this.portfolioCurQuantity - this.quantityToSell;
    let finalTotalCost = this.portfolioCurTotalCost - this.totalCostToBuy; 
    
    if(finalQuantityToSell == 0){
      await this.service.deletePortfolioItem(this.searchService.searchedTicker);

    }else{
      await this.service.updatePortfolioItem(this.searchService.searchedTicker, this.portfolioName, finalQuantityToSell , finalTotalCost);
    } 
    
    this.searchService.cashBalance = this.searchService.cashBalance + this.totalCostToSell;
    await this.service.updateBalanceData(this.searchService.cashBalance);

    
    await this.fetchPortfolioList(); //to update the buy/sell button appearance but won't work!

    this.stockSoldAlert = true;
    setTimeout(() => {
      this.stockSoldAlert = false;
    }, 5000); 
    
    // await this.fetchBalanceData(); why would I do it?
    
  }

  //showing/not showing error is based on whether company data is empty
  isDataAvailable(): boolean{
    //console.log('myresponsedata is', this.myresponseData);
    //return this.myresponseData && Object.keys(this.myresponseData).length > 0;
    return this.searchService.responseData && Object.keys(this.searchService.responseData).length > 0;

  }

  
  ngOnChanges(changes: SimpleChanges): void {
    //console.log('changes that are made', this.myresponseData);
  
      
  }

  ngOnDestroy(): void {

    
  }
}


