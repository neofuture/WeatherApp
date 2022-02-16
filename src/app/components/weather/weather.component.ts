import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {environment} from '../../../environments/environment';
import {icons} from '../../data/icons';
import {locations} from '../../data/locations';
import {LocationWeatherData} from '../../models/location-weather-data.class';
import {RequestWeatherParameters} from '../../models/request-weather-parameters.class';
import {RequestLocationParameters} from '../../models/request-location-parameters.class';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  /*
  Get the locations and the list of icons from a seperate data array/object
   */
  icons = icons;
  locations = locations;
  locationWeatherData: LocationWeatherData[] = [];
  locationCSS = {};

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    /*
    Loop the locations to create CSS class names
     */
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
    /*
    or execute the multiple function version
     */
    // this.getWeatherLocationsMultiFunction();
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
      /*
      We use the environment below so we can factor changes for different conditions.
      say for instance we have a test API and a live API
       */
      this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters)
        .toPromise()
        .then((locationData: any) => {
          /*
          Build request parameters
           */
          const requestWeatherParameters: RequestWeatherParameters = {
            lon: locationData.coord.lon,
            lat: locationData.coord.lat,
            appid: environment.apiKey,
            units: 'metric'
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
      const requestLocationParameters: RequestLocationParameters = {
        q: location,
        appid: environment.apiKey,
        units: 'metric'
      };
      this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters).subscribe((locationData: any) => {
        /*
        Build request parameters
         */
        const requestWeatherParameters: RequestWeatherParameters = {
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
          console.log('Whoops we hit an error calling onecall API', error);
        });
      }, (error) => {
        console.error('Whoops we hit an error calling weather API', error);
      });
    }
  }

  /*
  The next four functions are the same as above but are broken into individial function for
  better readability and debugging
   */
  getWeatherLocationsMultiFunction(): void {
    for (const location of this.locations) {
      this.getLocationData(location);
    }
  }

  getLocationData(location: string): void {
    const requestLocationParameters: RequestLocationParameters = {
      q: location,
      appid: environment.apiKey,
      units: 'metric'
    };
    this.apiService.call(environment.weatherApi + '/weather', 'get', requestLocationParameters).subscribe(
      (locationData: any) => {
        this.getWeatherData(location, locationData);
      }, (error) => {
        console.log('Whoops we hit an error calling weather API', error);
      });
  }

  getWeatherData(location: string, locationData: any): void {
    const requestWeatherParameters: RequestWeatherParameters = {
      lon: locationData.coord.lon,
      lat: locationData.coord.lat,
      appid: environment.apiKey,
      units: 'metric',
    };
    this.apiService.call(environment.weatherApi + '/onecall', 'get', requestWeatherParameters).subscribe(
      (weatherData: any) => {
        this.setLocationWeatherData(location, weatherData);
      }, (error) => {
        console.log('Whoops we hit an error calling onecall API', error);
      });
  }

  setLocationWeatherData(location: string, weatherData: any): void {
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
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
