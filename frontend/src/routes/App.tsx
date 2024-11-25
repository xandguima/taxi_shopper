import { useState } from 'react';
import backgroundImage from '../assets/background.jpg';
import { AdressForm } from '../components/form.tsx';
import { api } from '../service/api.tsx';
import { DriversOptions } from '../components/driversOptions.tsx';
import { Modal } from '../components/modal.tsx';
import { ErrorRequestEstimate } from '../components/modal.tsx';
import axios from 'axios';
export interface RideConfirmSchema {
  customer_id: string;
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number;
}


function App() {
  const [screen, setScreen] = useState<'form' | 'confirm' | 'history'>('form');
  const [responseEstimateRoute, setResponseEstimateRoute] = useState(null);
  const [messegeModal, setMessegeModal] = useState<ErrorRequestEstimate | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  async function handleEstimateClick(origin: string, destination: string) {
    const customer_id = 'c0ead346-1714-4fea-acc5-4ad5f96c8c64';
    try {
      const response = await api.post('/estimate', {
        customer_id,
        origin,
        destination,
      });
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

  function handleGoToHistorico(data: RideConfirmSchema) {
   
    console.log('Dados da viagem confirmada:', data);
    setScreen('history');
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
        {screen === 'history' && <div>Histórico (Em desenvolvimento)</div>}
        {modalVisible && <Modal errorRequestEstimate={messegeModal!} onClose={() => setModalVisible(false)} />}
      </div>
    </div>
  );
}

export default App;
