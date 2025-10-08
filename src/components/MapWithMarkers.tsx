import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction du bug des icônes de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div className="text-center">
              <strong className="text-lg">{location.nom}</strong>
              <p className="text-sm">{location.adresse}</p>
              <p className="text-sm font-semibold text-blue-600">{location.jour}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

