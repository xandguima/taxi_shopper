import axios from 'axios';
import { Modal } from './modal';
import { api } from '../service/api'
import {ErrorRequest} from "./modal";
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
  const [driverIdSelected, setDriverIdselected] = useState<number>(); // O driverId pode ser indefinido
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [modalVisible, setModalVisible] = useState(false);
  const [messegeModal, setMessegeModal] = useState<ErrorRequest | null>(null);

  // Efeito para buscar os dados do histórico de viagens quando o driverId mudar
  useEffect(() => {
    setLoading(true);
    async function getData() {
      try {
        const rides = await fetchHistoryData(customer_id, driverIdSelected);
        setHistoryData(rides); // Atualiza o estado com os novos dados

        const drivers = await fetchDrivers(customer_id);
        setDrivers(drivers);
      } catch (error) {
        console.error('Erro ao requisitar rota:', error);
        if (axios.isAxiosError(error) && error.response) {
          setMessegeModal(error.response.data);
        }
        // Se ocorrer algum erro, exibe a mensagem no modal
        setModalVisible(true);
      } finally {
        setLoading(false); // Marca como não carregando
      }
    };

    getData(); 
  }, [driverIdSelected]); // A dependência é o driverId. Sempre que mudar, a chamada à API será feita

  // Função para lidar com a mudança no driverId
  function handleDriverChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDriverId = Number(event.target.value);
    setDriverIdselected(selectedDriverId); // Atualiza o driverId, que pode ser undefined
  };

  if (loading) return <div>Carregando...</div>; // Exibe o texto de carregamento

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Histórico das suas viagens</h2>

      {/* Seletor de motorista, com a opção de não selecionar nenhum */}

      <select onChange={handleDriverChange} value={driverIdSelected} className=' rounded-md p-2 text-white bg-gray-600'>
        <option value="">Selecione um motorista</option>
        {
          drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))
        }
        {/* Adicione mais opções conforme necessário */}
      </select>

      <div className="mt-3">
        {!historyData ? (
          <div>Carregando...</div>
        ) : (
          <div>
            {historyData.map((ride: HistoryProps) => (

              <div key={ride.id} className='cursor-pointer p-4 rounded-lg my-4 bg-gray-700 shadow'>
                <p><strong>Origem: </strong> {ride.origin}</p>
                <p><strong>Destino: </strong> {ride.destination}</p>
                <p><strong>Distância: </strong> {(ride.distance/1000).toFixed(1)} Km</p>
                <p><strong>Duração: </strong>{convertDuration(ride.duration)}</p>
                {drivers.find((driver) => driver.id === ride.driver_id) && (
                  <p><strong>Motorista:</strong> {drivers.find((driver) => driver.id === ride.driver_id)?.name}</p>
                )}
                <p><strong>Valor:</strong> R$ {ride.value}</p>
              </div>
            ))
            }

          </div>
        )
        }
      </div>
       {/* Exibir o modal se houver erro */}
       {modalVisible && messegeModal && (
        <Modal onClose={() => setModalVisible(false)} errorRequest={messegeModal} />
      )}
    </div>
  );
}
