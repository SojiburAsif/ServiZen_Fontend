import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { env } from '@/lib/env';

const libraries: ("places")[] = ["places"];

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState(initialLocation?.address || '');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const hasApiKey = Boolean(env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          const location = { lat, lng, address };
          setSelectedLocation(location);
          setSearchQuery(address);
          onLocationSelect(location);
        }
      });
    }
  }, [onLocationSelect]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    if (!hasApiKey) {
      // Fallback: Just pass the searched text as address without geocoding
      const fallbackLocation = { lat: 0, lng: 0, address: searchQuery };
      setSelectedLocation(fallbackLocation);
      onLocationSelect(fallbackLocation);
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;
        const newLocation = { lat, lng, address };
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    });
  };

  // If there's an API error, just show the fallback search box
  if (!hasApiKey || loadError) {
    return (
      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="space-y-2">
          <Label htmlFor="location-search">Enter Address</Label>
          <div className="flex gap-2">
            <Input
              id="location-search"
              type="text"
              placeholder="Enter your full address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button type="button" onClick={handleSearch}>
              Set Address
            </Button>
          </div>
        </div>
        {selectedLocation && (
          <div className="text-sm font-medium text-emerald-600">
            Selected: {selectedLocation.address}
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) return <div><span className="loading loading-spinner text-primary"></span> Loading Location Selector...</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-search">Search Location</Label>
        <div className="flex gap-2">
          <Input
            id="location-search"
            type="text"
            placeholder="Enter address or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button type="button" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      <div className="h-64 w-full">
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          zoom={13}
          center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : { lat: 23.8103, lng: 90.4125 }} // Default to Dhaka
          onClick={onMapClick}
        >
          {selectedLocation && (
            <Marker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            />
          )}
        </GoogleMap>
      </div>

      {selectedLocation && (
        <div className="text-sm text-gray-600">
          Selected: {selectedLocation.address}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;