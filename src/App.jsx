import { useEffect, useState } from 'react';
import './App.css';
import useApiRequests from './components/useApiRequests';
import WeatherForm from './components/WeatherForm';
import WeatherCard from './components/WeatherCard';
import Description from './components/Description';

function App() {
  const [prompt, setPrompt] = useState('');
  const [units, setUnits] = useState('metric');
  const [weatherDataLoading, setWeatherDataLoading] = useState(false);
  const [weatherDescriptionLoading, setWeatherDescriptionLoading] =
    useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom hook to handle API requests. Fires when prompt changes.
  const { error, promptData, weatherData, weatherDescription } =
    useApiRequests(prompt);

  // Set error message if error is returned from API request.
  useEffect(() => {
    if (error) {
      setErrorMsg(error);
      setWeatherDataLoading(false);
    }
  }, [error]);

  // Set weatherDataLoading to false when weatherData is returned from API request.
  useEffect(() => {
    if (weatherData) {
      setWeatherDataLoading(false);
      setPrompt('');
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherDescription) {
      setWeatherDescriptionLoading(false);
    }
  }, [weatherDescription]);

  useEffect(() => {
    if (promptData && promptData.units) {
      setUnits(promptData.units);
    }
  }, [promptData]);

  // Handle form submission. Set prompt to user input.
  const handleSubmit = (newPrompt) => {
    setErrorMsg('');
    setWeatherDataLoading(true);
    setWeatherDescriptionLoading(true);
    setPrompt(newPrompt);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="page-title">Current Weather</h1>
        <WeatherForm onSubmit={handleSubmit} />
        {error && <p className="error">{errorMsg.message}</p>}
        {weatherDescription ? (
          <Description
            isLoading={weatherDescriptionLoading}
            weatherDescription={weatherDescription}
          />
        ) : (
          <Description isLoading={weatherDescriptionLoading} />
        )}
      </header>
      <main className="main-content">
        {weatherData.name && !errorMsg ? (
          <WeatherCard
            isLoading={weatherDataLoading}
            data={weatherData}
            units={units}
            country={promptData.country}
            USstate={promptData.state}
            setUnits={setUnits}
          />
        ) : (
          <WeatherCard isLoading={weatherDataLoading} setUnits={setUnits} />
        )}
      </main>
    </div>
  );
}

export default App;
