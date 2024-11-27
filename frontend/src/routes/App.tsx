import axios from 'axios';
import { useState } from 'react';
import { api } from '../service/api.tsx';
import { Modal } from '../components/modal.tsx';
import { History } from '../components/history.tsx';
import { AdressForm } from '../components/form.tsx';
import { ErrorRequest } from '../components/modal.tsx';
import backgroundImage from '../assets/background.jpg';
import { DriversOptions } from '../components/driversOptions.tsx';


export interface RideConfirmSchema {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number;
}


function App() {
  const [screen, setScreen] = useState<'form' | 'confirm' | 'history'>('form');

  const [responseEstimateRoute, setResponseEstimateRoute] = useState(null);
  const [messegeModal, setMessegeModal] = useState<ErrorRequest | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [customer_id, setCustomer_id] = useState('');

  async function handleEstimateClick(origin: string, destination: string) {
    const customer_id = 'c0ead346-1714-4fea-acc5-4ad5f96c8c64';

    try {
      const bodySchemaEstimate :{ customer_id: string; origin?: string; destination?: string } ={
        customer_id,
      }
      if(origin){
        bodySchemaEstimate.origin = origin;
      }
      if(destination){
        bodySchemaEstimate.destination = destination;
      }
      console.log("bodySchemaEstimate", bodySchemaEstimate);
      const response = await api.post('ride/estimate', bodySchemaEstimate);

      response.data.customer_id = customer_id;
      response.data.adressOrigin = origin;
      response.data.adressDestination = destination;

      setResponseEstimateRoute(response.data);
      setScreen('confirm');
    } catch (error: unknown) {  // Tipando o erro como unknown
      console.error('Erro ao estimar rota:', error);
      // Verifica se o erro é uma instância do AxiosError e possui a resposta
      if (axios.isAxiosError(error) && error.response) {
        setMessegeModal(error.response.data);
        setModalVisible(true);
      } else {
        // Tratamento genérico de erro, caso o erro não seja relacionado ao Axios
        console.error('Erro desconhecido:', error);
      }
    }
  }

  async function handleGoToHistorico(data: RideConfirmSchema) {
    console.log('Dados da viagem confirmada:', data);
    try{
      await api.post('/ride/confirm', data);
      const customer_id = data.customer_id;
      setCustomer_id(customer_id);
      setScreen('history');
    }catch(error: unknown){
      console.error('Erro ao requisitar rota:', error);
      if(axios.isAxiosError(error) && error.response){
        setMessegeModal(error.response.data);
        setModalVisible(true);
      }
    }
    
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="w-full max-w-2xl m-4 px-6 py-9 bg-gray-900 rounded-lg shadow-lg z-10">
        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">Taxi Shopper</h1>
        {screen === 'form' && <AdressForm onEstimateClick={handleEstimateClick} />}
        {screen === 'confirm' && <DriversOptions onGoToHistory={handleGoToHistorico} routeData={responseEstimateRoute} />}
        {screen === 'history' && <History customer_id={customer_id} />}
        {modalVisible && messegeModal && <Modal errorRequest={messegeModal} onClose={() => setModalVisible(false)} />}
      </div>
    </div>
  );
}

export default App;
