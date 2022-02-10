import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  data: any;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  getWeatherLocations(): void {
    const requestParameters = {
      q: 'London',
      apppid: environment.apiKey
    };
    this.apiService.call(environment.weatherApi, 'get', requestParameters).subscribe((data: any) => {
      this.data = data;
    });
  }
}
