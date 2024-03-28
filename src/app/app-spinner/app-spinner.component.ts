import { Component } from '@angular/core';
import { ResultSpinnerService } from '../result-spinner.service';

@Component({
  selector: 'app-app-spinner',
  templateUrl: './app-spinner.component.html',
  styleUrl: './app-spinner.component.css'
})
export class AppSpinnerComponent {

  constructor(public spinnerService: ResultSpinnerService){}
}
