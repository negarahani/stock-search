import { Injectable } from '@angular/core';
import { ResultSpinnerService } from './result-spinner.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptorService {

  constructor(private resultSpinnerService: ResultSpinnerService) { }

  intercept(req: HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{

    // Checking if the request URL contains 'search-autocomplete'
    if (req.url.includes('/search-autocomplete')) {
      return next.handle(req); // Skip interception (I already handled the autocomplete)
    }

    // i don't want to show spinner in case of autoupdate
    if (req.url.includes('/search-company')) {
      return next.handle(req); 
    }

    if (req.url.includes('/search-quote')) {
      return next.handle(req); 
    }

    this.resultSpinnerService.show();
    //console.log('HTTP request intercepted. Showing spinner.');
    return next.handle(req).pipe(
      finalize(()=> {
        this.resultSpinnerService.hide();
        //console.log('HTTP request completed. Hiding spinner.');
      }

      )
    )

  }
}
