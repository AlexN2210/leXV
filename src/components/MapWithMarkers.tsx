import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icône personnalisée avec SVG inline
const customIcon = L.divIcon({
  html: `<div style="background-color: red; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Composant pour ajuster automatiquement les bounds
const FitBounds = ({ locations }: { locations: any[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  return null;
};

interface Location {
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  jour: string;
}

interface MapWithMarkersProps {
  locations: Location[];
}

export const MapWithMarkers = ({ locations }: MapWithMarkersProps) => {
  // Calculer le centre de la carte (moyenne des positions)
  const center: [number, number] = locations.length > 0
    ? [
        locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
        locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length
      ]
    : [43.492, 3.629];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={locations} />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div style={{ textAlign: 'center', minWidth: '200px' }}>
              <strong style={{ fontSize: '16px', display: 'block', marginBottom: '5px' }}>
                {location.nom}
              </strong>
              <p style={{ fontSize: '14px', margin: '3px 0' }}>{location.adresse}</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb', margin: '3px 0' }}>
                {location.jour}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

