import React from "react";
import { getLocation } from "../lib/location";
import { AppState } from "../App";

interface GetLocationButtonProps {
  updateAppState: (newState: Partial<AppState>) => void;
}

export const GetLocationButton: React.FC<GetLocationButtonProps> = ({
  updateAppState,
}) => {
  const [loadingLocation, setLoadingLocation] = React.useState<boolean>(false);

  return (
    <button
      onClick={async () => {
        if (loadingLocation) return;

        try {
          setLoadingLocation(true);
          const location = await getLocation();
          console.log("location", location);
          updateAppState({
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        } catch (e) {
          if (e instanceof GeolocationPositionError) {
            if (e.PERMISSION_DENIED) {
              // todo: handle user denying location sharing
              updateAppState({
                location: {
                  permissionDenied: true,
                },
              });
            }
          }
          updateAppState({
            error: "Error getting location",
          });
        }
        setLoadingLocation(false);
      }}
    >
      {loadingLocation ? "Getting yo location..." : "Find Me Food"}
    </button>
  );
};
