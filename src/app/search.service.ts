import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private datePipe: DatePipe) {}

  showEmptyInputError: boolean = false;

  //data related to home 
  searchedTicker: string = '';
  responseData: any;
  quoteData: any;
 
  currentTimestmp: number = Date.now();
  currentTime: string = this.datePipe.transform(this.currentTimestmp, 'yyyy-MM-dd HH:mm:ss')?? '';//just to monitor if the templte is being updated every 15 seconds

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



 

  //method to allow communication between watchlist and search-home component
  sendTickerClicked(ticker: string) {
   
      this.tickerClickedSource.next(ticker);
      console.log('inside search service');
    }
    
    shouldDoAutoUpdate() {
      
      return this.shouldAutoUpdate;
    }
    toggleAutoUpdate(flag: boolean) {
      this.shouldAutoUpdate = flag;
    }
  
}
