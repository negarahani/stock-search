import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../../../app-service.service';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-news-tab',
  templateUrl: './news-tab.component.html',
  styleUrl: './news-tab.component.css'
})
export class NewsTabComponent implements OnInit{

  constructor(private service: AppServiceService, private searchService: SearchService){}

  filteredNews: any;
  selectedItem: any;

  ngOnInit(): void {
    this.getTopNewsData(this.searchService.searchedTicker);
  }

  
 
  
  async getTopNewsData(tickerSymbol: string){
    try {
      const data: any = await this.service.getTopNews(tickerSymbol);
      if (data){
        //console.log('top news data is:', data);
        let newsCounter = 0;
        const validNews = [];

      for (let i = 0; i < data.length && newsCounter < 20; i++) {
        const newsData = data[i];
        
        // Checking if all required attributes are present and not null
        if (
          newsData.image &&
          newsData.headline &&
          newsData.datetime &&
          newsData.url &&
          newsData.summary &&
          newsData.source
        ) {
          newsCounter++;
          validNews.push(newsData);
        }
      }

      console.log('Top 20 valid news data:', validNews);
      this.filteredNews = validNews;
      }
    } catch (error) {
      console.error('Error fetching top news data:', error);
    }
    
  }

  // Converting timestamp to PST and format date
  //datetime from finbub is in EST (UTC-5)
  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); //this has to be in milliseconds
    // Converting to PST (UTC-8) by subtracting 3 hours in miliseconds
    date.setTime(date.getTime() - (3 * 60 * 60 * 1000));
    // Formatting the date as requested
    return date.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  }

  
}
