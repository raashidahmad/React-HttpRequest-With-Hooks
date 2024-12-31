import { Places } from "./Places";
import { ErrorPage } from "./ErrorPage";
import { fetchAvailablePlaces } from "../helpers/http-helper";
import { useFetch } from "../hooks/useFetch";


export const AvailablePlaces = ({ onSelectPlace }: any) => {
  const {
    fetchedData: availablePlaces,
    isLoading,
    error
  } = useFetch(fetchAvailablePlaces);

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