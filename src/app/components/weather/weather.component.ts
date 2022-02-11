import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {environment} from '../../../environments/environment';
import {icons} from '../../data/icons';
import {locations} from '../../data/locations';

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
    }
    this.getWeatherLocations();
  }

  getWeatherLocations(): void {
    for (const location of this.locations) {
      const requestLocationParameters = {
        q: location,
        appid: environment.apiKey,
        units: 'metric'
      };
      this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters).subscribe((locationData: any) => {
        const requestWeatherParameters = {
          lon: locationData.coord.lon,
          lat: locationData.coord.lat,
          appid: environment.apiKey,
          units: 'metric',
          // exclude: 'hourly,daily'
        };
        this.apiService.call(environment.weatherApi + '/onecall', 'get', requestWeatherParameters).subscribe((weatherData: any) => {

          let basePop = 0;
          for (const pop of weatherData.hourly) {
            if (pop.pop > basePop) {
              basePop = pop.pop;
            }
          }

          this.locationWeatherData[location] = {
            temperature: parseInt(weatherData.current.temp, 10),
            main: weatherData.current.weather[0].main,
            humidity: weatherData.current.humidity,
            chanceOfRain: parseInt(String(basePop * 100), 10),
            description: this.capitalizeFirstLetter(weatherData.current.weather[0].description),
            icon: weatherData.current.weather[0].icon
          };
        });
      });
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
