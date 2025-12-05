import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LOCATIONS, MAP_TILE_URL, MAP_ATTRIBUTION, DRC_CENTER, DEFAULT_ZOOM } from '../constants';
import { MapLocation, LocationType } from '../types';
import { Pickaxe, ShieldAlert, MapPin, AlertTriangle } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

// Fix for default Leaflet markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  locations: MapLocation[];
  onLocationSelect: (location: MapLocation) => void;
  selectedLocation: MapLocation | null;
}

// Helper to create custom div icons using Lucide icons
const createCustomIcon = (type: LocationType, color: string) => {
  let iconComponent;
  if (type === LocationType.MINERAL) iconComponent = <Pickaxe size={20} color="white" fill={color} />;
  else if (type === LocationType.CONFLICT) iconComponent = <ShieldAlert size={20} color="white" fill={color} />;
  else iconComponent = <MapPin size={20} color="white" fill={color} />;

  const html = ReactDOMServer.renderToString(
    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg ${type === LocationType.CONFLICT ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`}>
      {iconComponent}
    </div>
  );

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-icon', // Use a custom class to strip default styles if needed
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const FlyToLocation = ({ location }: { location: MapLocation | null }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.coordinates.lat, location.coordinates.lng], 10, {
        duration: 1.5
      });
    }
  }, [location, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ locations, onLocationSelect, selectedLocation }) => {
  
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[DRC_CENTER.lat, DRC_CENTER.lng]} 
        zoom={DEFAULT_ZOOM} 
        style={{ height: '100%', width: '100%', background: '#111827' }}
        zoomControl={false}
      >
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={MAP_TILE_URL}
        />
        
        <FlyToLocation location={selectedLocation} />

        {locations.map((loc) => {
          let color = '#3b82f6'; // Default blue
          if (loc.type === LocationType.CONFLICT) color = '#ef4444'; // Red
          if (loc.type === LocationType.MINERAL) color = '#eab308'; // Yellow/Gold

          return (
            <React.Fragment key={loc.id}>
              {/* Add a circle radius for conflict zones to show spread */}
              {loc.type === LocationType.CONFLICT && (
                <CircleMarker 
                  center={[loc.coordinates.lat, loc.coordinates.lng]}
                  radius={20}
                  pathOptions={{ color: color, fillColor: color, fillOpacity: 0.2, weight: 1 }}
                />
              )}
              
              <Marker 
                position={[loc.coordinates.lat, loc.coordinates.lng]}
                icon={createCustomIcon(loc.type, color)}
                eventHandlers={{
                  click: () => onLocationSelect(loc),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{loc.type}</p>
                    <button 
                      onClick={() => onLocationSelect(loc)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded w-full"
                    >
                      View Details & Analyze
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
