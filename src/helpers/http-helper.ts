export const fetchAvailablePlaces = async() => {
    const response = await fetch('http://localhost:3000/places');
    if (!response.ok) {
        throw new Error('Failed to fetch places');
    }
    const data: any = await response.json();
    return data.places;
}

export const updatePlaces = async(places: any[]) => {
    var placesStr = JSON.stringify({
        'places': places
    });
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: placesStr,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch places');
    }

    const data: any = response.json();
    return data.message;
}

export const fetchUserPlaces = async() => {
    const response = await fetch('http://localhost:3000/user-places');
    if (!response.ok) {
        throw new Error('Failed to fetch places');
    }
    const data: any = await response.json();
    return data.places;
}