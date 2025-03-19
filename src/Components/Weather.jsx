import { useState, useRef, useEffect } from 'react';
import './Weather.css';
import search1 from '../assets/search1.png';
import sun from '../assets/sun.png';
import cloudy from '../assets/cloudy.png';
import rain from '../assets/rain.png';
import storm from '../assets/storm.png';
import mist from '../assets/mist.png';
import humidity from '../assets/humidity.png';
import wind from '../assets/wind.png';

export default function Weather() {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null);

  // Weather icons based on OpenWeatherMap codes
  const allicon = {
    '01d': sun,     // Clear sky (day)
    '01n': sun,     // Clear sky (night)
    '02d': cloudy,  // Few clouds (day)
    '02n': cloudy,  // Few clouds (night)
    '03d': cloudy,  // Scattered clouds
    '03n': cloudy,  
    '04d': cloudy,  // Broken clouds
    '04n': cloudy,  
    '09d': rain,    // Shower rain
    '09n': rain,    
    '10d': rain,    // Rain
    '10n': rain,    
    '11d': storm,   // Thunderstorm
    '11n': storm,   
    '50d': mist,    // Mist
    '50n': mist    
  };

  // Function to fetch weather data
  const search = async (city) => {
    if (city.trim() === "") {
      alert("Please enter a city name.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const weatherIconCode = data.weather[0]?.icon;
        const icon = allicon[weatherIconCode] || sun;  // Use mapped icon or fallback to sun
        setWeatherData({
          temperature: Math.floor(data.main.temp),
          location: data.name,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          icon: icon
        });
      } else {
        alert("City not found. Please enter a valid city name.");
      }
    } catch (error) {
      alert("Error fetching weather data. Please try again later.");
      console.error("Error fetching weather:", error);
    }
  };

  // Load default city on first render
  useEffect(() => {
    search('Sargodha');
  }, []);

  return (
    <div>
      <div className="weather">
        <div className="search-bar">
          <input ref={inputRef} type="text" placeholder="Search" />
          <img src={search1} alt="Search Icon" onClick={() => search(inputRef.current.value)} />
        </div>

        {weatherData ? (
          <>
            <img src={weatherData.icon} alt="weather icon" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>

            <div className="weather-data">
              <div className="col">
                <img src={humidity} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind} alt="Wind Speed" />
                <div>
                  <p>{weatherData.wind} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
