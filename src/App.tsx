import { useRef, useState, useCallback, useEffect } from 'react';

import logoImg from './assets/logo.png';
import Modal from './components/Modal';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { Places } from './components/Places';
import { AvailablePlaces } from './components/AvailablePlaces';
import { fetchUserPlaces, updatePlaces } from './helpers/http-helper';
import { ErrorPage } from './components/ErrorPage';

const App = () => {
  const selectedPlace = useRef<any>();
  const [userPlaces, setUserPlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isUserPlaceLoading, setUserPlaceLoading] = useState<boolean>(false);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState<any>(null);

  useEffect(() => {
    const loadUserPlaces = async () => {
      const savedPlaces = await fetchUserPlaces();
      setUserPlaces(savedPlaces);
    }
    loadUserPlaces();
  }, []);

  function handleStartRemovePlace(place: any) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace: any) {
    setUserPlaces((prevPickedPlaces: any) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place: any) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      setUserPlaceLoading(true);
      await updatePlaces([selectedPlace, ...userPlaces]);
      setUserPlaceLoading(false);
    } catch(error: any) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({ message: error.message || 'Something went wrong'});
      setUserPlaceLoading(false);
    }
    
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place: any) => place.id !== selectedPlace.current.id)
    );

    try {
      setUserPlaceLoading(true);
      const filteredPlaces = userPlaces.filter((p: any) => p.id !== selectedPlace.current.id);
      await updatePlaces(filteredPlaces);
      setUserPlaceLoading(false);
    } catch(error: any) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({ message: error.message || 'Something went wrong'});
      setUserPlaceLoading(false);
    }
    setModalIsOpen(false);
  }, [userPlaces]);

  const handleError = () => {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces &&  <ErrorPage 
          title="Update Error" 
          message={errorUpdatingPlaces.message} 
          onConfirm={handleError}
        />}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          isLoading={isUserPlaceLoading}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces 
          onSelectPlace={handleSelectPlace} 
        />
      </main>
    </>
  );
}
export default App;
