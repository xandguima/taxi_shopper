import { RideConfirmSchema } from '../routes/App';
import { convertDuration } from '../utils';

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

  const { customer_id, distance, duration, options, adressOrigin, adressDestination } = routeData;

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
    
    onGoToHistory(rideConfirmData);
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-3'>Estimativa de Rota:</h2>
      <div className='pl-2'>
        <p><strong>Origem:</strong> {adressOrigin}</p>
        <p><strong>Destino:</strong> {adressDestination}</p>
        <p><strong>Distância:</strong> {(distance / 1000).toFixed(2)} Km</p>
        <p><strong>Duração:</strong> {formattedDuration}</p>
        <h3 className='text-xl font-bold'>Opções de Motorista:</h3>

        {options.map((driver) => (
          <div key={driver.id} onClick={() => handleSelectDriver(driver)} className='cursor-pointer p-4 rounded-lg my-4 bg-gray-700 shadow'>
            <p className='text-lg font-bold text-yellow-200'><strong>Motorista:</strong> {driver.name}</p>
            <p>{driver.description}</p>
            <p><strong>Avaliação:</strong> {driver.review.rating} estrelas</p>
            <p>{driver.review.comment}</p>
            <p><strong>Carro:</strong> {driver.car}</p>
            <p className='text-lg font-bold'><strong>Valor:</strong> R$ {driver.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
