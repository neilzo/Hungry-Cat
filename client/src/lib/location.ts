export const getLocation: () => Promise<GeolocationPosition> = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        {
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } else {
      reject("Geolocation unavailable");
    }
  });
};

export const metersToMiles = (meters: number) => {
  return meters * 0.000621371;
};
