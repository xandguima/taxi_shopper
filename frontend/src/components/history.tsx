import axios from 'axios';
import { Modal } from './modal';
import { api } from '../service/api'
import { ErrorRequest } from "./modal";
import { convertDuration } from '../utils';
import { useEffect, useState } from 'react';

// Função que faz a chamada à API com o driverId opcional
interface HistoryProps {
  id: number;
  customer_id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number;
  value: number;
}
interface Driver {
  id: number;
  name: string;
  description: string;
  car: string;
  review: {
    rating: number;
    comment: string;
  }
  rate: number
  min_distance: number;
}


async function fetchHistoryData(customer_id: string, driverId?: number,) {
  if (!driverId) {
    try {
      const response = await api.get(`ride/${customer_id}`);
      return response.data;

    } catch (error: unknown) {
      console.error('Erro ao requisitar rota:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("fetchHistoryData :error.response.data == ", error.response.data)
        throw new Error(error.response.data);

      }
      throw new Error('Erro ao requisitar rota');
    }

  }
  //const driverIdString = String(driverId);
  // Se o driverId for fornecido, adiciona à query string; caso contrário, faz a consulta sem esse parâmetro
  try {
    const response = await api.get(`ride/${customer_id}?driver_id=${driverId}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao requisitar rota:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error('Erro ao requisitar rota');
  }
};

async function fetchDrivers(customer_id: string) {
  try {
    const ridesbycustomer = await fetchHistoryData(customer_id);
    const allDriversIdsInRides = ridesbycustomer.map((ride: HistoryProps) => ride.driver_id);
    const driversIds = [...new Set(allDriversIdsInRides)] as number[];

    const drivers = await Promise.all(
      driversIds.map(async (driverId) => {
        const response = await api.get(`driver/${driverId}`);
        return response.data;
      })
    )
    return drivers;
  } catch (error: unknown) {
    console.error('Erro ao requisitar rota:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data);
    }
    throw new Error('Erro ao requisitar rota');
  }
}

export function History({ customer_id }: { customer_id: string }) {
  const [historyData, setHistoryData] = useState<HistoryProps[]>([]);
  const [driverIdSelected, setDriverIdselected] = useState<number>();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);
  const [messegeModal, setMessegeModal] = useState<ErrorRequest | null>(null);


  useEffect(() => {
    setLoading(true);
    async function getData() {
      try {
        const rides = await fetchHistoryData(customer_id, driverIdSelected);
        setHistoryData(rides); 

        const drivers = await fetchDrivers(customer_id);
        setDrivers(drivers);
      } catch (error) {
        console.error('Erro ao requisitar rota:', error);
        if (axios.isAxiosError(error) && error.response) {
          setMessegeModal(error.response.data);
        }
       
        setModalVisible(true);
      } finally {
        setLoading(false); 
      }
    };

    getData();
  }, [driverIdSelected]); 

 
  function handleDriverChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDriverId = Number(event.target.value);
    setDriverIdselected(selectedDriverId); // Atualiza o driverId, que pode ser undefined
  };

  if (loading) return <div>Carregando...</div>; // Exibe o texto de carregamento

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Histórico das suas viagens</h2>

      <div className="mb-6">
        <label htmlFor="driver-select" className="text-white text-lg">Selecione um motorista</label>
        <select 
          id="driver-select"
          onChange={handleDriverChange}
          value={driverIdSelected}
          className="mt-2 w-full rounded-md p-2 text-white bg-gray-600"
        >
          <option value="">Selecione um motorista</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 text-white">
        <p>Total de viagens: {historyData.length}</p>
      </div>

      <div className="mt-6">
        {!historyData ? (
          <div className="text-white">Carregando...</div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-96" style={{
            scrollbarWidth: 'thin', 
            scrollbarColor: 'rgba(255, 255, 255, 0.4) rgba(0, 0, 0, 0.1)', 
          }}>
            {historyData.map((ride: HistoryProps) => (
              <div 
                key={ride.id} 
                className="cursor-pointer p-4 rounded-lg bg-gray-700 shadow-md hover:shadow-lg transition duration-300"
              >
                <p className="text-white"><strong>Origem: </strong> {ride.origin}</p>
                <p className="text-white"><strong>Destino: </strong> {ride.destination}</p>
                <p className="text-white"><strong>Distância: </strong> {(ride.distance / 1000).toFixed(1)} Km</p>
                <p className="text-white"><strong>Duração: </strong>{convertDuration(ride.duration)}</p>

                {drivers.find((driver) => driver.id === ride.driver_id) && (
                  <p className="text-white">
                    <strong>Motorista:</strong> {drivers.find((driver) => driver.id === ride.driver_id)?.name}
                  </p>
                )}

                <p className="text-white"><strong>Valor:</strong> R$ {ride.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && messegeModal && (
        <Modal onClose={() => setModalVisible(false)} errorMessage={messegeModal.error_code} errorDetails={messegeModal.error_description} />
      )}
    </div>
  );
  
}
