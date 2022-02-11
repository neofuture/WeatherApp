import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {environment} from '../../../environments/environment';
import {icons} from '../../data/icons';
import {locations} from '../../data/locations';
import {WeatherData} from '../../models/weather-data.class';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  icons = icons;
  locations = locations;
  locationData: any;
  locationWeatherData = {};
  locationCSS = {};

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    for (const location of this.locations) {
      this.locationCSS[location] = location.replace(/\s/g, '');
      this.locationWeatherData[location] = {
        temperature: undefined,
        humidity: undefined,
        chanceOfRain: undefined
      };
    }
  }

  getWeatherLocations(): void {
    for (const location of this.locations) {
      const requestParameters = {
        q: location,
        apppid: environment.apiKey
      };
      this.apiService.call(environment.weatherApi, 'get', requestParameters).subscribe((locationData: any) => {
        this.locationData = locationData;
      });
    }
  }

}
