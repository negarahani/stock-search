 //reference the result spinner code from https://www.youtube.com/watch?v=H9KLIbisVJ8&list=PLGgRWRWCsQzTHVkAzyen7A6NtEzNzk6gb&index=33&t=13s

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultSpinnerService {

 private spinnerCounter = new BehaviorSubject<number>(0);
 spinnerCounter$ = this.spinnerCounter.asObservable();

 show(){
  this.spinnerCounter.next(this.spinnerCounter.value + 1);
  //console.log('Spinner Count incremented. Counter:', this.spinnerCounter.value);
 }

 hide(){
  this.spinnerCounter.next(this.spinnerCounter.value - 1);
  //console.log('. Spinner Counter decremented. Counter:', this.spinnerCounter.value);
 }
}
