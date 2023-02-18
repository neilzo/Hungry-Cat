import React from "react";
import "./App.css";
import { GetFoodButton } from "./components/GetFoodButton";
import { metersToMiles } from "./lib/location";
import { GetDrankButton } from "./components/GetDrankButton";

interface UserLocation {
  latitude?: number;
  longitude?: number;
  permissionDenied?: boolean;
}

interface YelpResult {
  name: string;
  rating: number;
  id: string;
  review_count: number;
  distance: number;
  image_url: string;
}

export interface AppState {
  location: UserLocation;
  results?: YelpResult[];
  error?: string;
}

const DEFAULT_STATE: AppState = {
  location: {
    latitude: undefined,
    longitude: undefined,
    permissionDenied: false,
  },
  results: undefined,
  error: undefined,
};

function App() {
  const [appState, setAppState] = React.useState<AppState>(DEFAULT_STATE);
  const { error, results } = appState;

  const updateAppState = (newState: Partial<AppState>) => {
    setAppState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        {error && (
          <div className="alert error">
            <p>{error}</p>
          </div>
        )}
      </header>
      <main>
        {!results && (
          <>
            <GetFoodButton updateAppState={updateAppState} />
            <GetDrankButton updateAppState={updateAppState} />
          </>
        )}
        {results &&
          results.map((result) => (
            <div key={result.id}>
              <h2>{result.name}</h2>
              <img
                src={result.image_url}
                alt={`Main image for ${result.name}`}
                className="image"
              />
              <p>Rating: {result.rating}</p>
              <p>Reviews: {result.review_count}</p>
              <p>
                Distance from yo ass: {Math.ceil(result.distance)} meters /{" "}
                {metersToMiles(result.distance).toFixed(2)} miles
              </p>
              <div className="card-footer">
                <button>Swipe left</button>
                <button>I'm interested...</button>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

export default App;
