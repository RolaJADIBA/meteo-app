import React from 'react';
import './App.css';

import './weather-icons-master/css/weather-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from './app_component/weather.component';
import Form from './app_component/form.component';

// api call api.openweathermap.org/data/2.5/weather?q=London,uk
const Api_Key = "9e114bd40af7a5d95841ad3cf4f93db8";

class App extends React.Component{
  constructor(){
    super();
    this.state={
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_min: null,
      temp_max: null,
      description: "",
      error: false
    };

    this.weatherIcon = {
      Thunderstorm:"wi-thunderstorm",
      Drizzel:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog"
    };
  }

  calCelsius(temp){
    let cell = Math.floor(temp-273.15);
    return cell; 
  }

  get_WeatherIcon(icons,rangeId){
    switch(true){
      case rangeId >= 200 && rangeId<=232:
      this.setState({icon:this.weatherIcon.Thunderstorm});
      break;
      case rangeId >= 300 && rangeId<=321:
        this.setState({icon:this.weatherIcon.Drizzel});
      break;
      case rangeId >= 500 && rangeId<=531:
        this.setState({icon:this.weatherIcon.Rain});
      break;
      case rangeId >= 600 && rangeId<= 622:
        this.setState({icon:this.weatherIcon.Snow});
      break;
      case rangeId >= 701 && rangeId<= 781:
        this.setState({icon:this.weatherIcon.Atmosphere});
      break;
      case rangeId===800:
        this.setState({icon:this.weatherIcon.Clear});
      break;
      case rangeId >=801 && rangeId<=804:
        this.setState({icon:this.weatherIcon.Clouds});
      break;
      default:
          this.setState({icon:this.weatherIcon.Clouds});
    }
  }

  getWeather = async e =>{
    e.preventDefault();

    const country = e.target.elements.country.value;
    const city = e.target.elements.city.value;

    if(city && country){
    const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`);

    const response = await api_call.json();
    console.log(response);

    this.setState({
      city: `${response.name}, ${response.sys.country}`,
      counrty:response.sys.country,
      celsius: this.calCelsius(response.main.temp),
      temp_min: this.calCelsius(response.main.temp_min),
      temp_max: this.calCelsius(response.main.temp_max),
      description: response.weather[0].description,
    });

    this.get_WeatherIcon(this.weatherIcon,response.weather[0].id);
  }else{
    this.setState({error:true});
  }
  };

  render(){
    return(
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        cityname={this.state.city}
        country={this.state.country} 
        temp_celsius={this.state.celsius}
        temp_min={this.state.temp_min}
        temp_max={this.state.temp_max}
        description={this.state.description}
        weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}

export default App;
