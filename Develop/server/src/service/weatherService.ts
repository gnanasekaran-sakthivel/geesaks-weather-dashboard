import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;

  name?: string;
  local_names?: { [key: string]: string };
  country?: string;
  state?: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  dateValue: Date;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    dateValue: Date
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.dateValue = dateValue;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string =
    process.env.API_BASE_URL || "https://api.openweathermap.org";
  private forecast5DaysEndpoint: string =
    process.env.API_5DAYFORECAST_ENDPOINT || "/data/2.5/forecast";
  private geoCodeEndpoint: string =
    process.env.API_GEOCODE_ENDPOINT || "/geo/1.0/direct";

  private apiKey: string = process.env.API_KEY || "";
  private cityName: string = "";

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(
      `${this.baseURL}${this.geoCodeEndpoint}?${query}&appid=${this.apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch location data");
    return response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) throw new Error("No location data found");
    const { lat, lon } = locationData;
    return { lat: lat, lon: lon };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `q=${this.cityName}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const geoQuery = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(geoQuery);
    if (!locationData || locationData.length == 0)
      throw new Error("There is no location data");
    return this.destructureLocationData(locationData[0]);
  }

  // TODO: Create fetchWeatherData method
  // list of weather condition codes: https://openweathermap.org/weather-conditions
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(
      `${this.baseURL}${this.forecast5DaysEndpoint}?${weatherQuery}&appid=${this.apiKey}`
    );
    if (!response.ok) throw new Error("Failed to retrieve weather data");
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    if (!response || !response.list)
      throw new Error("Unable to parse current weather");
    if (response.list.length == 0) throw new Error("Weather data is empty");

    const firstElement = response.list[0];
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US"); // Format as MM/DD/YYYY

    const weatherData: Weather = {
      city: this.cityName,
      date: formattedDate,
      icon: firstElement.weather[0]?.icon || "",
      iconDescription: firstElement.weather[0]?.description || "",
      tempF: firstElement.main.temp,
      windSpeed: firstElement.wind.speed,
      humidity: firstElement.main.humidity,
      dateValue: today,
    };

    return weatherData;
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [];
    const Milliseconds24Hrs: number = 24 * 60 * 60 * 1000;

    forecastArray.push(currentWeather);

    const tomorrow = new Date(Date.now() + Milliseconds24Hrs);

    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(tomorrow);
      nextDate.setDate(nextDate.getDate() + i); // Increment the date by `i` days

      const formattedNextDate = nextDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      const firstMatchingElement = weatherData.find(
        (item) => item.dt_txt && item.dt_txt.startsWith(formattedNextDate)
      );

      if (firstMatchingElement) {
        const weather: Weather = {
          city: this.cityName,
          date: nextDate.toLocaleDateString("en-US"), // Format as MM/DD/YYYY
          icon: firstMatchingElement.weather[0]?.icon || "",
          iconDescription: firstMatchingElement.weather[0]?.description || "",
          tempF: firstMatchingElement.main.temp,
          windSpeed: firstMatchingElement.wind.speed,
          humidity: firstMatchingElement.main.humidity,
          dateValue: nextDate,
        };

        forecastArray.push(weather);
      }
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log(
      `Getting weather forecast for city:${this.cityName}, coordinates latitude:${coordinates.lat}, longitude:${coordinates.lon}`
    );
    const weatherDataJson = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherDataJson);
    const forecastWeather: any[] = this.buildForecastArray(
      currentWeather,
      weatherDataJson.list
    );

    return forecastWeather;
  }
}

export default new WeatherService();
