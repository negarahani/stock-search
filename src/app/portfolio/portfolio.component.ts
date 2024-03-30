

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { AppServiceService } from '../app-service.service';
import { OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';





@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {

  //related to spinner
  isBalanceLoading: boolean = true;
  isPortfolioLoading: boolean = true;

  portfolioEmptyAlert: boolean = false;


  selectedItem: any;
  selectedTicker: any;
  selectedCurPrice: any;

  completeArray: any[] = [];

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

  constructor(public searchService: SearchService, private service: AppServiceService, private route: ActivatedRoute, private fb: FormBuilder){

  }

  

  ngOnInit(): void {
    console.log('Portfolio Iniitalised');
    this.searchService.pathString = this.route.snapshot.routeConfig?.path ?? '';
    console.log('current string path is', this.searchService.pathString);

    //initilize the forms
    this.buyForm = this.fb.group({
      value: [0] 
    });
    this.sellForm = this.fb.group({
      value: [0]
    });

    //remove any previous items in portfolioList
    this.searchService.portfolioList = [];
    

    //console.log('ngonInit');
    this.fetchBalanceData();
    this.populateData();
    
    
  }

  async fetchBalanceData() {
    this.isBalanceLoading = true;
    try{
      let data: any = await this.service.getBalanceData();
      if (data.length > 0) { // Check if data array is not empty
        this.searchService.cashBalance = data[0].cash_balance;
        //console.log('Cash balance is:', this.searchService.cashBalance);
      } else {
        //console.log('No balance data found.');
      }
    } catch(error){
      //console.error('Error fetching balance data:', error);
    } finally {
      this.isBalanceLoading = false; 
    }
    
  }

  async fetchData(){

    let data = await this.service.getPortfolio();
    //console.log(data);
    if (data){
      this.searchService.portfolioList = data;

      if (this.searchService.portfolioList.length == 0) {
        this.portfolioEmptyAlert = true;
      } else {
        this.portfolioEmptyAlert = false;
      }

    }
  }
  
  async populateData(){
    this.isPortfolioLoading = true;

    try{
      this.completeArray = [];

      await this.fetchData();
      //console.log("portfolio list is", this.searchService.portfolioList);

      if (this.searchService.portfolioList && Object.keys(this.searchService.portfolioList).length > 0){
        for (const item of this.searchService.portfolioList){
          let quoteData: any = await this.service.getStockQuote2(item.ticker);
          //console.log('quote data it:', quoteData);
          //values are calculated dynamically
          let curPrice = quoteData.c;
          let avgCostShare = item.total_cost / item.quantity;
          let change = avgCostShare - curPrice;
          let marketValue = item.quantity * curPrice;

          const curItem = {"ticker":item.ticker, "company_name": item.company_name, "quantity": item.quantity, "total_cost": item.total_cost, 
          "current_price": quoteData.c, "average_cost_share": avgCostShare, "change": change, "market_value": marketValue};
          
          this.completeArray.push(curItem);
          

        }
        //console.log('updated completearray is: ', this.completeArray);
      } else {
        //console.log('no item found in portfolio');
      }
    } catch (error){
      console.error('Error fetching portfolio data:', error);
    } finally {
      this.isPortfolioLoading = false; 
    }

    
  }

  async buyStock(itemToBuy: any){

    await this.populateData();

    //reset these values
    this.buyForm.get('value')?.reset(0);
    this.totalCostToBuy = 0;
    this. quantityToBuy = 0;

    this.selectedItem = itemToBuy;
    this.selectedTicker = itemToBuy.ticker;
    this.selectedCurPrice = itemToBuy.current_price;

    const valueControl = this.buyForm.get('value');
    
    
    if (valueControl) {
      // Subscribe to value changes of the input
      valueControl.valueChanges.subscribe(value => {
          this.quantityToBuy = value;
          this.totalCostToBuy = value * this.selectedCurPrice;
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
    //console.error('Form control not found');
  }

}
  async finalBuy(itemToBuy: any){

    let finalQuantityToBuy = itemToBuy.quantity + this.quantityToBuy;
    let finalTotalCost = itemToBuy.total_cost + this.totalCostToBuy; 
    await this.service.updatePortfolioItem(itemToBuy.ticker, itemToBuy.company_name, finalQuantityToBuy , finalTotalCost);
    
    this.searchService.cashBalance = this.searchService.cashBalance - this.totalCostToBuy;
    await this.service.updateBalanceData(this.searchService.cashBalance);
    
    await this.populateData();
    
    this.stockBoughtAlert = true;
    setTimeout(() => {
      this.stockBoughtAlert = false;
    }, 5000); 
   
}

  
  

  async sellStock(itemtoSell: any){

    await this.populateData();

    //reset these values
    this.sellForm.get('value')?.reset(0);
    this.totalCostToSell = 0;
    this.quantityToSell = 0;

    this.selectedItem = itemtoSell;
    this.selectedTicker= itemtoSell.ticker;
    this.selectedCurPrice = itemtoSell.current_price;

    const valueControl = this.sellForm.get('value');

    if (valueControl) {
      // Subscribe to value changes of the input
      valueControl.valueChanges.subscribe(value => {
        this.quantityToSell = value;
        this.totalCostToSell = value * this.selectedCurPrice;
        //console.log('Entered value:', value); 
        //console.log('totalcosttosell',this.totalCostToSell);
        //console.log('cash balance', this.searchService.cashBalance);
        if (this.quantityToSell < 1 || this.quantityToSell > itemtoSell.quantity){
          this.hideSellButton = true;
        }else{
          this.hideSellButton = false;
        }

        if (this.quantityToSell > itemtoSell.quantity){
          this.showSellError = true;
        }else{
          this.showSellError = false;
        }
      });
    }
    else {
      console.error('Form control not found');
    }
   
  }

  async finalSell(itemToSell: any){

    let finalQuantityToSell = itemToSell.quantity - this.quantityToSell;
    let finalTotalCost = itemToSell.total_cost - this.totalCostToSell;

    if (finalQuantityToSell == 0){
      await this.service.deletePortfolioItem(itemToSell.ticker);
    } else{
      await this.service.updatePortfolioItem(itemToSell.ticker, itemToSell.company_name, finalQuantityToSell, finalTotalCost);
    }

    this.searchService.cashBalance = this.searchService.cashBalance + this.totalCostToSell;
    await this.service.updateBalanceData(this.searchService.cashBalance);

    await this.populateData();

    this.stockSoldAlert = true;
    setTimeout(() => {
      this.stockSoldAlert = false;
    }, 5000);

  }

}
