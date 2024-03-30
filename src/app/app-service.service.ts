import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppServiceService {


  private baseUrl = 'http://localhost:8080/';
  // private baseUrl = '/' //added in when preparing for deployment
  

  autoUpdateInterval  : any;

  
  constructor(private http: HttpClient) { }

  getData(tickerSymbol: string){
    return this.http.get(`${this.baseUrl}search-company/${tickerSymbol}`);
  }
  
  async getDataForPF(tickerSymbol: string){
    return lastValueFrom(this.http.get(`${this.baseUrl}search-company/${tickerSymbol}`));
  }

  async getStockQuote(tickerSymbol: string){
    return await lastValueFrom(this.http.get(`${this.baseUrl}search-quote/${tickerSymbol}`));
  }

  async getHourlyPrice(tickerSymbol: string, fromDate: string, toDate: string){
    const apiUrl = `${this.baseUrl}search-hourly-price/${tickerSymbol}/${fromDate}/${toDate}`;
    return await lastValueFrom(this.http.get(apiUrl));
  }


  getAutcoComplete(tickerSymbol: string){
    return this.http.get(`${this.baseUrl}search-autocomplete/${tickerSymbol}`);
  }

  async getCompanyPeers(tickerSymbol: string){
    return await lastValueFrom(this.http.get(`${this.baseUrl}search-peers/${tickerSymbol}`));
  }

  async getTopNews(tickerSymbol: string){
    return await lastValueFrom(this.http.get(`${this.baseUrl}search-news/${tickerSymbol}`));
  }

  async getHistoricalChart(tickerSymbol: string){
    try{
      return await lastValueFrom(this.http.get(`${this.baseUrl}search-chart/${tickerSymbol}`));
    }
    catch(error){
      console.log('an error occured while fetching historiacal chart data: ', error);
      return null;
    }
  }

  async getSentiments(tickerSymbol: string){
    try{
      return await lastValueFrom(this.http.get(`${this.baseUrl}search-sentiments/${tickerSymbol}`));
    }
    catch(error){
      console.log('an error occurred while fetching insider sentiments data', error);
      return null;
    }
  }
  
  async getRecommendations(tickerSymbol: string){
    try{
      return await lastValueFrom(this.http.get(`${this.baseUrl}search-recommendations/${tickerSymbol}`));
    }
    catch(error){
      console.log('an error occured while fetching recommendations data: ', error);
      return null;
    }
  }
  
  async getEarnings(tickerSymbol: string){
    try{
      return await lastValueFrom(this.http.get(`${this.baseUrl}search-earnings/${tickerSymbol}`));
    }
    catch(error){
      console.log('an error occured while fetching earnings data: ', error);
      return null;
    }
    
  }

  //methods corresponding to wathcList
  addFavoriteStock(tickerSymbol: string, companyName: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}api/favorites/addFavorites`, { tickerSymbol, companyName });
  }

  getFavoriteStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}api/favorites/getFavorites`);
  }

  deleteFavoriteStock(tickerSymbol: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}api/favorites/deleteFavorites/${tickerSymbol}`);
  }

  //methods corresponding to Portfolio

  async getBalanceData(){
    return await lastValueFrom(this.http.get(`${this.baseUrl}api/wallet/getBalance`));
  }

  async updateBalanceData(cash_balance: number){
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}api/wallet/updateBalance`, { cash_balance }));
  }

  async getPortfolio(){
    //we use last value from to convert an obervable to a promise because await works with promises
    //refactor is to use async and await
    try{
      return await lastValueFrom(this.http.get<any[]>(`${this.baseUrl}api/portfolio/getPortfolio`));
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async getData2(tickerSymbol: string){
    return lastValueFrom(this.http.get(`${this.baseUrl}search-company/${tickerSymbol}`));
  }

  async getStockQuote2(tickerSymbol: string){
    return await lastValueFrom(this.http.get(`${this.baseUrl}search-quote/${tickerSymbol}`));
  }
  
  async getFavoriteStocks2() {
    try{
      return await lastValueFrom(this.http.get<any[]>(`${this.baseUrl}api/favorites/getFavorites`));
    } catch(error){
      console.log('an error occured while fetching favorite stocks');
      return null;
    }
    } 
    
  
  
  // Method to add a portfolio item
  async addPortfolioItem(
    tickerSymbol: string,
    companyName: string,
    stockQuantity: number,
    avgCostShare: number,
    totalCost: number,
    change: number,
    curPrice: number,
    marketValue: number
  ){
    const requestBody = {
      "ticker": tickerSymbol,
      "company_name": companyName,
      "quantity": stockQuantity,
      "average_cost_share": avgCostShare,
      "total_cost":totalCost,
      "change":change,
      "current_price":curPrice,
      "market_value":marketValue
    };

   
    // Make the HTTP POST request to add a portfolio item
    try{
      return await lastValueFrom(this.http.post<any>(`${this.baseUrl}api/portfolio/addPortfolio`, requestBody));
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async updatePortfolioItem(tickerSymbol: string, companyName: string, stockQuantity: number, totalCost: number){
    const requestBody = {
      "ticker": tickerSymbol,
      "company_name": companyName,
      "quantity": stockQuantity,
      "total_cost":totalCost
    };

    //Make HTTP Post request to add a new item or update an existing one
    try{
      return await lastValueFrom(this.http.put<any>(`${this.baseUrl}api/portfolio/updatePortfolio/${tickerSymbol}`, requestBody));
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  // Method to delete a portfolio item
  async deletePortfolioItem(tickerSymbol: string) {
    // Make the HTTP DELETE request to delete a portfolio item
    try{
      return await lastValueFrom(this.http.delete<any>(`${this.baseUrl}api/portfolio/deletePortfolio/${tickerSymbol}`));
  }
  catch(error){
    console.log(error);
    return null;
  }
    }
    

}









