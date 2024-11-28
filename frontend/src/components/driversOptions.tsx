import { RideConfirmSchema } from '../routes/App';
import { convertDuration } from '../utils/index';
import { Map } from './maps';
interface RouteData {
  customer_id: string;
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Driver[];
  adressOrigin: string;
  adressDestination: string;
  routeResponse: RouteResponse;
}


export interface RouteResponse {
  polyline: {
    encodedPolyline: string;
  }
}

interface Driver {
  id: number;
  name: string;
  description: string;
  car: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
}

interface DriversOptionsProps {
  onGoToHistory: (data: RideConfirmSchema) => void;
  routeData: RouteData | null;
}

export function DriversOptions({ onGoToHistory, routeData }: DriversOptionsProps) {
  if (!routeData) return <div>Carregando...</div>;

  const { customer_id, distance, duration, options, adressOrigin, adressDestination, routeResponse, origin, destination } = routeData;

  const formattedDuration = convertDuration(duration);

  async function handleSelectDriver(driver: Driver) {
    const rideConfirmData: RideConfirmSchema = {
      customer_id: customer_id,
      origin: adressOrigin,
      destination: adressDestination,
      distance,
      duration,
      driver: {
        id: driver.id,
        name: driver.name,
      },
      value: driver.value,
    };
    console.log("rideConfirmData", rideConfirmData);

    onGoToHistory(rideConfirmData);
  }


  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Rota:</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-lg text-white"><strong>Origem:</strong> {adressOrigin}</p>
          <p className="text-lg text-white"><strong>Destino:</strong> {adressDestination}</p>
        </div>
        
        <div>
          <p className="text-lg text-white"><strong>Distância:</strong> {(distance / 1000).toFixed(2)} Km</p>
          <p className="text-lg text-white"><strong>Duração:</strong> {formattedDuration}</p>
        </div>
  
       
        <Map origin={origin} destination={destination} routeResponse={routeResponse} />
  
        <h3 className="text-xl font-bold text-white mt-6 mb-3">Opções de Motorista:</h3>
        
        
        <div
          className="overflow-y-auto max-h-96 space-y-4"
          style={{
            scrollbarWidth: 'thin', 
            scrollbarColor: 'rgba(255, 255, 255, 0.4) rgba(0, 0, 0, 0.1)', 
          }}
        >
          {options.map((driver) => (
            <div key={driver.id} className="p-4 rounded-lg bg-gray-700 shadow-md hover:shadow-lg transition duration-300">
              <p className="text-lg font-bold text-yellow-200"><strong>Motorista:</strong> {driver.name}</p>
              <p className="text-white">{driver.description}</p>
              <p className="text-white"><strong>Avaliação:</strong> {driver.review.rating} estrelas</p>
              <p className="text-white">{driver.review.comment}</p>
              <p className="text-white"><strong>Carro:</strong> {driver.car}</p>
              <p className="text-lg font-bold text-white"><strong>Valor:</strong> R$ {driver.value}</p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded mt-4 transition duration-200" onClick={() => handleSelectDriver(driver)}>
                Escolher Motorista
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
