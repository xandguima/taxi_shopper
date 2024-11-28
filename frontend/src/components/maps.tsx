import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polyline, MarkerF } from '@react-google-maps/api';
import { RouteResponse } from '../components/driversOptions';

interface Origin {
  latitude: number;
  longitude: number;
}

interface Destination {
  latitude: number;
  longitude: number;
}

type MapProps = {
  origin: Origin;
  destination: Destination;
  routeResponse: RouteResponse;
};
export function Map({ origin, destination, routeResponse }: MapProps) {
  const [decodedPath, setDecodedPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const MAPS_API_KEY = process.env.GOOGLE_API_KEY;
  if (!MAPS_API_KEY) {
    throw new Error('MAPS_API_KEY is not defined');
  }
 
  const MarkStyle = isGoogleMapsLoaded
    ? {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: 'red',
      fillOpacity: 0.8,
      scale: 6,
      strokeColor: 'red',
      strokeWeight: 2,
    }
    : undefined;
  
  const mapContainerStyle = {
    width: '100%',
    height: '250px',
    border: '1px solid #ccc',
    borderRadius: '10px',
  };

  const center = {
    lat: origin.latitude,
    lng: origin.longitude,
  };



  useEffect(() => {
    function checkGoogleMapsLoaded() {
      if (window.google && window.google.maps && window.google.maps.geometry) {
        setIsGoogleMapsLoaded(true);
        const path = google.maps.geometry.encoding
          .decodePath(routeResponse.polyline.encodedPolyline)
          .map((latLng) => ({
            lat: latLng.lat(),
            lng: latLng.lng(),
          }));
        setDecodedPath(path); // Atualiza o estado com o caminho decodificado
      } else {
        console.log('Google Maps geometry library is not loaded yet.');
        setTimeout(checkGoogleMapsLoaded, 100); // Tentativa a cada 100ms
      }
    };
    checkGoogleMapsLoaded();
  }, [routeResponse.polyline.encodedPolyline]);



  return (
    <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={['geometry']}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
      onLoad={(map) => console.log('Mapa carregado!', map)}
        
      >

      {decodedPath.length > 0 && (
        <Polyline
          path={decodedPath}
          options={{
            strokeColor: '#0000FF', 
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}

      <MarkerF
        position={{ lat: origin.latitude, lng: origin.longitude }}
        title="Ponto de Origem"
        icon={MarkStyle}
      />
      <MarkerF
        position={{ lat: destination.latitude, lng: destination.longitude }}
        title="Ponto de Destino"
        icon={MarkStyle}
      />
    </GoogleMap>
    </LoadScript >
  );
}
