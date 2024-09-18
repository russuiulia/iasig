import Geocode from 'react-geocode';

Geocode.setApiKey();

export const getGeoFromLatLng = (
  newLat: string,
  newLng: string
): Promise<any> => {
  return new Promise((res) => {
    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        res(response);
      },
      (error) => {
        res({ error });
      }
    );
  });
};

export const getGeoFromAddress = (place: string): Promise<any> => {
  return new Promise((res) => {
    Geocode.fromAddress(place).then(
      (response) => {
        res(response);
      },
      (error) => {
        res({ error });
      }
    );
  });
};
