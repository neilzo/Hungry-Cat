import React from "react";
import "./App.css";
import { GetLocationButton } from "./components/GetLocationButton";

interface UserLocation {
  latitude?: number;
  longitude?: number;
  permissionDenied?: boolean;
}

export interface AppState {
  location: UserLocation;
  results: any;
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
  const { error } = appState;

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
        <GetLocationButton updateAppState={updateAppState} />
      </main>
    </div>
  );
}

export default App;
