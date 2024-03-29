import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ResultSpinnerService } from '../result-spinner.service';




@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  //related to Watchlist
  isWatchlistLoading: boolean = true;

  watchlistEmptyAlert: boolean = false;

  private tickerClickedSubscription: Subscription | undefined;

  
  constructor(private service: AppServiceService, public searchService: SearchService, private route: ActivatedRoute, public spinnerService: ResultSpinnerService){}

  public watchlistList: any[] = [];
  completeArray: any[] = []; //array to keep watchlist items along with thier quote data

  ngOnInit(){
    console.log('Watchlist Iniitalised');
    this.searchService.pathString = this.route.snapshot.routeConfig?.path ?? '';
    console.log('current string path is', this.searchService.pathString);

    this.populateWatchlist();


  }

  async fetchWatchlist(){
    let data = await this.service.getFavoriteStocks2();
    console.log('favorite stocks data is:', data);
    if (data){
      this.searchService.favoriteStocks = data;
      this.watchlistList = this.searchService.favoriteStocks;
    }

    if (this.watchlistList.length == 0) {
      this.watchlistEmptyAlert = true;
    } else {
      this.watchlistEmptyAlert = false;
    }
    
  }

  async populateWatchlist(){

    this.isWatchlistLoading = true;

    try{
      this.completeArray = [];
      await this.fetchWatchlist();
      console.log('favorite stock list is:', this.searchService.favoriteStocks);
      if (this.searchService.favoriteStocks && Object.keys(this.searchService.favoriteStocks).length > 0){
        for (const item of this.searchService.favoriteStocks){
          let quoteData: any = await this.service.getStockQuote2(item.tickerSymbol);
          console.log('quote data is:', quoteData);
          //caclulating the values dynamically
          let curPrice = quoteData.c;
          let change = quoteData.d;
          let changePercent = quoteData.dp;

          const curItem = {"ticker":item.tickerSymbol, "company_name": item.companyName, "current_price": curPrice, 
          "change": change, "change_percent":changePercent};

          this.completeArray.push(curItem);
        }
        console.log('updated completearray is: ', this.completeArray);
      } else{
        console.log('no item found in watchlist');
      }
    } catch(error){
      console.log('Error fetching watchlist data', error);
    } finally {
      this.isWatchlistLoading = false;
    }
    
    
  }

  


  removeFromWatchlist(ticker: string){
    this.service.deleteFavoriteStock(ticker).subscribe(
      () => {
        //console.log('Successfully removed from watchlist:', ticker);
        // Update watchlistList after successful removal
        this.watchlistList = this.watchlistList.filter(item => item.tickerSymbol !== ticker);
        this.searchService.favoriteStocks = this.watchlistList; //update the favoriteStockList in the searchService

        if (this.watchlistList.length == 0) {
          this.watchlistEmptyAlert = true;
        } else {
          this.watchlistEmptyAlert = false;
        }
        
      },
      (error: any) => {
        console.error('Error removing from watchlist:', error);
      }
    );
  }

  searchClickedTicker(ticker: string){
    console.log("div clicked", ticker);
    this.searchService.sendTickerClicked(ticker);
  }
}
