import { useEffect, useState } from "react";
import { Places } from "./Places";
import { ErrorPage } from "./ErrorPage";
import { sortPlacesByDistance } from "../loc";
import { fetchAvailablePlaces } from "../helpers/http-helper";


export const AvailablePlaces = ({ onSelectPlace }: any) => {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlaces = async() => {
        try {
            const places: any = await fetchAvailablePlaces();
            navigator.geolocation.getCurrentPosition((position) => {
                const sortedPlaces: any = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
                setAvailablePlaces(sortedPlaces);
                setIsLoading(false);
            });
        } catch (error: any) {
            setError({message: error.message || 'something went wrong'});
            setIsLoading(false);
        }
        
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="Error" message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="Loading Places..."
      fallbackText="No places available"
      onSelectPlace={onSelectPlace}
    />
  );
}