import React from "react";
import { getLocation } from "../lib/location";
import { AppState } from "../App";

interface GetDrankButtonProps {
  updateAppState: (newState: Partial<AppState>) => void;
}

export const GetDrankButton: React.FC<GetDrankButtonProps> = ({
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
          const resp = await fetch(
            `/api/find-drank?lat=${location.coords.latitude}&lon=${location.coords.longitude}`
          );
          const respJson = await resp.json();
          updateAppState({
            results: respJson.businesses.sort(
              (a: any, b: any) => a.distance - b.distance
            ),
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
      {loadingLocation ? "Getting yo location..." : "Hungo for Drank"}
    </button>
  );
};
