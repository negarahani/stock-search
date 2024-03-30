
import { Component, OnChanges, ViewChild, input, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchService } from '../search.service';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Subscription, from } from 'rxjs';
import { EventEmitter,Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import './search-home.component.css'; 
import { ResultSpinnerService } from '../result-spinner.service';




@Component({
  selector: 'app-search-home',
  templateUrl: './search-home.component.html',
  styleUrls: ['./search-home.component.css'],
  encapsulation: ViewEncapsulation.None,
  
})
export class SearchHomeComponent implements OnDestroy, OnInit{

  //realted to spinner
  isCompanyDataLoading: boolean = false;
  isQuoteDataLoading: boolean = false;
  
  private activatedRoute = inject(ActivatedRoute);
    tickerInUrl = this.activatedRoute.snapshot.params['ticker'];


  private tickerClickedSubscription: Subscription | undefined;

  
  selectOption(option: string) {
    this.searchTicker(option);
  } 

  resultsCleared: boolean = false;
  fromDateFormatted: any;
  toDateFormatted: any;
  
  autoUpdateInterval: any; //we need this to store the interval ID returned by timeInterval
  autocompleteSubscription: Subscription | undefined;

  ACArray: any;
  isACLoading: boolean = false;


  

  formGroup !: FormGroup; //will be initialized later


  constructor(private router: Router, private route: ActivatedRoute, private service: AppServiceService, public searchService: SearchService, private fb: FormBuilder, private datePipe: DatePipe, public spinnerService: ResultSpinnerService) {
    this.formGroup = this.fb.group({ // Initialize formGroup in the constructor
      'tickerValue': ['']
    });

  }
  
  ngOnInit(){

    console.log('Search home Iniitalised');
    this.searchService.pathString = this.route.snapshot.routeConfig?.path ?? '';
    console.log('current string path is', this.searchService.pathString);



    this.initForm();

    if (this.tickerInUrl !== 'home') {
      this.formGroup.get('tickerValue')?.setValue(this.tickerInUrl);
      this.searchTicker(this.tickerInUrl)
    }

    /*************** Related to TickerClicked Subcription *****************/
    this.tickerClickedSubscription = this.searchService.tickerClicked$.subscribe(ticker => {
      
    console.log('************* tickerclicked is subscribed to ************');
    //put the ticker in your input
    this.formGroup.get('tickerValue')?.setValue(ticker);
    

    
    this.searchService.searchedTicker = ticker;

    this.searchService.toggleAutoUpdate(true);

      
    //this.searchTicker(ticker);
    //resetting the autcomplete ?? not working
    this.ACArray = [];
    //console.log('AC array is:', this.ACArray);

      // Clear previous interval if exists
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
    }

    // Cancel any ongoing autocomplete request
    if (this.autocompleteSubscription) {
      this.autocompleteSubscription.unsubscribe();
    }

    this.getCompanyData(ticker);
    this.getquoteData(ticker);
  

    //resume autoupdates if we come from another route and results have not been cleared

    this.autoUpdateInterval = setInterval(() => {

      this.updateResults(ticker);
    }, 15000);

  
    });

   

    if (this.searchService.responseData){
      this.autoUpdateInterval = setInterval(() => {
        this.updateResults(this.searchService.responseData.ticker);
  
      }, 15000);
    }
    
  }


  // mention this https://youtu.be/nWbVz1xjvOk?si=OPimmLgU-BREZVpS as a reference for autocomplete
  initForm() {


    // Fetch autocomplete data on input change
    this.formGroup.get('tickerValue')!.valueChanges.subscribe((value: string) => { //! means value changes wont be null
      //console.log('Input value changed:', value);
      if (value !== '') {
        this.getAutoCompleteData(value);
      } else {
        this.ACArray = []; // Clear autocomplete suggestions if input is empty
      }
    });
  }

  searchTicker(searchInputValue: string) {

    //clear any previous results
    this.clearResults();

    
    console.log('form submission done');
    searchInputValue = searchInputValue.toUpperCase();
    this.searchService.searchedTicker = searchInputValue; //will this work? yes!
    console.log('Type of searchedTicker:', typeof this.searchService.searchedTicker);
    console.log('searched ticker is:',this.searchService.searchedTicker);


    //resetting the autcomplete ?? not working
    this.ACArray = [];
    console.log('AC array is:', this.ACArray);

    this.searchService.toggleAutoUpdate(true);

    if (this.resultsCleared) {
      this.resultsCleared = false};

    // Clear previous interval if exists
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
    }

    // Cancel any ongoing autocomplete request
    if (this.autocompleteSubscription) {
      this.autocompleteSubscription.unsubscribe();
    }

    this.getCompanyData(searchInputValue);
    this.getquoteData(searchInputValue); //should I make these two await?
  

    if (this.searchService.shouldDoAutoUpdate()){
      this.autoUpdateInterval = setInterval(() => {
        this.updateResults(searchInputValue);
  
      }, 15000);
    }
    

   
  }

  
  updateResults(inputValue: string){
    console.log('UpdateResults was executed');
    if (!this.searchService.shouldDoAutoUpdate()) {
      return; // Don't execute updateResults if auto update is turned off
    }
    console.log(this.searchService.pathString);
    console.log('The string path is,', this.searchService.pathString);
    if(this.searchService.pathString == "search/:ticker" && !this.resultsCleared){
      //this.getCompanyDataForAU(inputValue);
      this.getquoteDataForAU(inputValue);

      //update the current timestamp
      let currentTimestmp: number = Date.now();
      this.searchService.currentTime = this.datePipe.transform(currentTimestmp, 'yyyy-MM-dd HH:mm:ss')?? '';
    }
    
  }



  getCompanyData(inputValue: string){
    this.isCompanyDataLoading = true;
    
    this.service.getData(inputValue).subscribe(
      response => {
        this.searchService.responseData = response;
        console.log('ResponseData property is:', this.searchService.responseData);
        this.router.navigate(['/search', inputValue]); // I only navigate to this route when I get company data
        this.isCompanyDataLoading = false;

      },
      error => {
        console.log('Error is', error);
        this.isCompanyDataLoading = false;
        
      },
    );
  }


 //getting stock quote data from node server
  async getquoteData(inputValue: string){
    this.isQuoteDataLoading = true;
    
    try{
      let data = await this.service.getStockQuote(inputValue);
      console.log('quoteData',data);
      if (data){
        this.searchService.quoteData = data;
      }
    } catch(error){
      console.log('Error fetching quoteData');
    } finally {
      this.isQuoteDataLoading = false;
     
    }

   

  }

  //I need to redefine the getCompanyData and getQuoteData for when we are autoupdating (hence no spinner)
  getCompanyDataForAU(inputValue: string){
    
    this.service.getData(inputValue).subscribe(
      response => { 
        this.searchService.responseData = response;
        console.log('ResponseData property is:', this.searchService.responseData);
        this.router.navigate(['/search', inputValue]); // I only navigate to this route when I get company data
        
      },
      error => {
        console.log('Error is', error);   
      },
    );
  }

  async getquoteDataForAU(inputValue: string){
   
    try{
      let data = await this.service.getStockQuote(inputValue);
      console.log('quoteData',data);
      if (data){
        this.searchService.quoteData = data;
      }
    } catch(error){
      console.log('Error fetching quoteData');
    }
  }


  getAutoCompleteData(inputValue: string){
    
    // Cancel any ongoing autocomplete request
    if (this.autocompleteSubscription) {
      this.autocompleteSubscription.unsubscribe();
    }

    this.isACLoading = true;

    this.autocompleteSubscription = this.service.getAutcoComplete(inputValue).subscribe(
      (response: any) => {
        const results = (response as any).result
        console.log('Autocomplete response:', response);
        const filteredResults = results.filter((result: any) => 
        result.type == 'Common Stock' && !result.symbol.includes('.')
      );
        this.searchService.autoCompleteData = filteredResults;

        this.ACArray = filteredResults.map((result: any) => ({
          symbol: result.symbol,
          description: result.description
        }));
        console.log("ACArray:", this.ACArray);
        
      },
      error => {
        console.log('Error is', error);
      },
      () => {
        console.log('request is complete');
        this.isACLoading = false;
      }
    );

    
  }


  clearResults(){

    this.router.navigate(['search/home']);

    this.isACLoading = false; // spinner has to go when we clear data (or initiate search)

    console.log('results cleared');

    this.ACArray = [];

    this.resultsCleared = true;

  
    
    this.searchService.responseData = null;
    this.searchService.quoteData = null;


    this.searchService.toggleAutoUpdate(false);

    // Clear auto update interval
    if (this.autoUpdateInterval) {
        clearInterval(this.autoUpdateInterval);
        this.autoUpdateInterval = undefined; // Set autoUpdateInterval to undefined after clearing
    }
    

    

    return false; //to prevent default form submision when clicking on the clear button
  }

  
  ngOnDestroy(): void {
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval);
      this.autoUpdateInterval = undefined; 
    }

    if (this.autocompleteSubscription) {
      this.autocompleteSubscription.unsubscribe();

    }

    if (this.tickerClickedSubscription) {
      this.tickerClickedSubscription.unsubscribe();
      //console.log('unsubscribed from tickerClickedSubscription');
    }

    
  }

  
}


