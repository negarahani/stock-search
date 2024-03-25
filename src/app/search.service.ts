import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  //data related to home 
  searchedTicker: string = '';
  responseData: any;
  quoteData: any;
 

  autoCompleteData: any;
  isMarketOpen: boolean = true;
  
  //data related to Watchlist
  favoriteStocks : any[] = []; //with a better implementaion maybe I could remove this

  //data related to portfolio
  public cashBalance: number = 0.00;
  public portfolioList: any[] = [];  //with a better implementaion maybe I could remove this
  public isInPortfolio : boolean = false;
 

  pathString: string = '';

  private shouldAutoUpdate: boolean = true;

  private tickerClickedSource = new Subject<string>();
  tickerClicked$ = this.tickerClickedSource.asObservable();


  constructor() {}

  //method to allow communication between watchlist and search-home component
  sendTickerClicked(ticker: string) {
   
      this.tickerClickedSource.next(ticker);
    }
    
    shouldDoAutoUpdate() {
      return this.shouldAutoUpdate;
    }
    toggleAutoUpdate(flag: boolean) {
      this.shouldAutoUpdate = flag;
    }
  
}
