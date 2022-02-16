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
      /*
      No spaces in CSS class's, we use these css classes to assign a background image to the panel
       */
      this.locationCSS[location] = location.replace(/\s/g, '');
    }
    this.getWeatherLocations();
    /*
    or execute promise version
     */
    // this.getWeatherLocationsPromise();
  }

  /*
  This is an example using Promises
   */
  getWeatherLocationsPromise(): void {
    for (const location of this.locations) {
      const requestLocationParameters = {
        q: location,
        appid: environment.apiKey,
        units: 'metric'
      };

      this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters)
        .toPromise()
        .then((locationData: any) => {
          /*
          Build request parameters
           */
          const requestWeatherParameters = {
            lon: locationData.coord.lon,
            lat: locationData.coord.lat,
            appid: environment.apiKey,
            units: 'metric',
          };
          this.apiService.call(environment.weatherApi + '/onecall', 'get', requestWeatherParameters)
            .toPromise()
            .then((weatherData: any) => {
              /*
              calculate the max pop value (Probability of precipitation)
               */
              let basePop = 0;
              for (const pop of weatherData.hourly) {
                if (pop.pop > basePop) {
                  basePop = pop.pop;
                }
              }
              /*
              Build request parameters
              */
              this.locationWeatherData[location] = {
                temperature: parseInt(weatherData.current.temp, 10),
                main: weatherData.current.weather[0].main,
                humidity: weatherData.current.humidity,
                chanceOfRain: parseInt(String(basePop * 100), 10),
                description: this.capitalizeFirstLetter(weatherData.current.weather[0].description),
                icon: weatherData.current.weather[0].icon
              };
            }).catch((error) => {
            console.error(error);
          });
        }).catch((error) => {
        console.error(error);
      });
    }
  }

  /*
  This is an example using Subscriptions
   */
  getWeatherLocations(): void {
    for (const location of this.locations) {
      const requestLocationParameters = {
        q: location,
        appid: environment.apiKey,
        units: 'metric'
      };
      this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters).subscribe((locationData: any) => {
        /*
        Build request parameters
         */
        const requestWeatherParameters = {
          lon: locationData.coord.lon,
          lat: locationData.coord.lat,
          appid: environment.apiKey,
          units: 'metric',
        };
        this.apiService.call(environment.weatherApi + '/onecall', 'get', requestWeatherParameters).subscribe((weatherData: any) => {
          /*
          calculate the max pop value (Probability of precipitation)
           */
          let basePop = 0;
          for (const pop of weatherData.hourly) {
            if (pop.pop > basePop) {
              basePop = pop.pop;
            }
          }
          /*
          Build request parameters
           */
          this.locationWeatherData[location] = {
            temperature: parseInt(weatherData.current.temp, 10),
            main: weatherData.current.weather[0].main,
            humidity: weatherData.current.humidity,
            chanceOfRain: parseInt(String(basePop * 100), 10),
            description: this.capitalizeFirstLetter(weatherData.current.weather[0].description),
            icon: weatherData.current.weather[0].icon
          };
        }, (error) => {
          alert('Whoops we hit an error calling onecall API');
        });
      }, (error) => {
        alert('Whoops we hit an error calling weather API');
      });
    }
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
