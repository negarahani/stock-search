import { Component, OnInit} from '@angular/core';
import { AppServiceService } from './app-service.service';
import { error } from 'console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'test2';

  responseData: any;

  constructor(private service: AppServiceService){

  }

}
