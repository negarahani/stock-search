import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {

  private tickerClickedSubscription: Subscription | undefined;

  
  constructor(private service: AppServiceService, public searchService: SearchService, private route: ActivatedRoute){}

  public watchlistList: any[] = [];

  ngOnInit(){
    console.log('Watchlist Iniitalised');
    this.searchService.pathString = this.route.snapshot.routeConfig?.path ?? '';
    console.log('current string path is', this.searchService.pathString);

    // Subscribe to getFavoriteStocks here
    this.service.getFavoriteStocks().subscribe(
      (data: any) => {
        //console.log('subscribed to getFavoriteStocks');
        this.searchService.favoriteStocks = data;
        this.watchlistList = this.searchService.favoriteStocks;
          
      },
      (error: any) => {
          console.error('Error fetching favorite stocks:', error);
      }
    );

  }

  removeFromWatchlist(ticker: string){
    this.service.deleteFavoriteStock(ticker).subscribe(
      () => {
        //console.log('Successfully removed from watchlist:', ticker);
        // Update watchlistList after successful removal
        this.watchlistList = this.watchlistList.filter(item => item.tickerSymbol !== ticker);
        this.searchService.favoriteStocks = this.watchlistList; //update the favoriteStockList in the searchService
      },
      (error: any) => {
        console.error('Error removing from watchlist:', error);
      }
    );
  }

  searchClickedTicker(ticker: string){
    //console.log("div clicked", ticker);
    //console.log('start of the problem!');
    this.searchService.sendTickerClicked(ticker);
  }
}
