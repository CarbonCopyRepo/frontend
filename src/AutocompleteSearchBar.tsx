import React, { useRef, useEffect } from 'react';

interface AutocompleteSearchBarProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function AutocompleteSearchBar({ onLocationSelect }: AutocompleteSearchBarProps) {
  const autocompleteInput = useRef<HTMLInputElement>(null);
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (autocompleteInput.current && !autocomplete.current && window.google) {
      autocomplete.current = new window.google.maps.places.Autocomplete(
        autocompleteInput.current,
        { types: ['address'], componentRestrictions: { country: "us" } }
      );

      autocomplete.current.addListener('place_changed', onPlaceChanged);
    }
  }, []);

  function onPlaceChanged() {
    if (!autocomplete.current) return;
    const place = autocomplete.current.getPlace();
    if (place.geometry && place.geometry.location) {
      onLocationSelect(place.geometry.location.lat(), place.geometry.location.lng());
    } else {
      console.log('No location available for input: ' + autocompleteInput.current?.value);
    }
  }

  return (
    <input
      ref={autocompleteInput}
      type="text"
      placeholder="Enter an address"
    />
  );
}

export default AutocompleteSearchBar;
