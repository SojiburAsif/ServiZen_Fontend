/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin } from 'lucide-react';


const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
}

// ম্যাপে ক্লিক করলে পজিশন ধরার জন্য সাব-কম্পোনেন্ট
function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// সার্চ করলে ম্যাপের ভিউ পরিবর্তন করার জন্য সাব-কম্পোনেন্ট
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [25.6217, 88.6354] // Dinajpur default
  );
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // ল্যাটিচিউড-লংগিচিউড থেকে ঠিকানা বের করার ফাংশন (Reverse Geocoding)
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const formattedAddress = data.display_name || "Unknown Address";
      setAddress(formattedAddress);
      onLocationSelect({ lat, lng, address: formattedAddress });
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  }, [onLocationSelect]);

  // জায়গা লিখে সার্চ করার ফাংশন (Forward Geocoding)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${searchQuery}`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        setAddress(display_name);
        onLocationSelect({ lat: newPos[0], lng: newPos[1], address: display_name });
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    fetchAddress(lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
          Search Location
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search city, area or street..."
              className="bg-zinc-900 border-zinc-800 h-12 pl-10 rounded-xl focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-12 px-6 rounded-xl"
          >
            {loading ? "..." : "SEARCH"}
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-72 w-full rounded-2xl border border-zinc-800 overflow-hidden relative z-0 shadow-inner">
        <MapContainer 
          center={position} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <ChangeView center={position} />
          <MapEvents onClick={onMapClick} />
          <Marker position={position} />
        </MapContainer>
        
        {/* Floating Indicator */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 pointer-events-none">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-white font-medium uppercase tracking-widest">Live Map (Free)</span>
        </div>
      </div>

      {address && (
        <div className="flex gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
          <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Selected Location</p>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;