import { useEffect, useState } from "react";
import { sortPlacesByDistance } from "../loc";

export function useFetch (fetchFn: () => {}) {
    const [isLoading, setIsLoading] = useState<boolean>();
    const [error, setError] = useState<any>(null);
    const [fetchedData, setFetchedData] = useState<any>([]);
    
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
              try {
                const places: any = await fetchFn();
                navigator.geolocation.getCurrentPosition((position) => {
                  const sortedPlaces: any = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
                  setFetchedData(sortedPlaces);
                  setIsLoading(false);
                });
              } catch (error: any) {
                setError({ message: error.message || 'something went wrong' });
                setIsLoading(false);
              }
        }
        fetchData();
    }, [fetchFn])

    return {
        isLoading,
        error,
        fetchedData,
        setFetchedData,
        setError,
        setIsLoading
    }
}