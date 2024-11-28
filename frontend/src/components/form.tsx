import { useState } from "react";

type AdressFormsProps = {
  onEstimateClick: (adress_origin: string, adress_destination: string,customer_id: string) => Promise<void>; // A função agora retorna uma Promise
};

export function AdressForm({ onEstimateClick }: AdressFormsProps) {

  const [adress_origin, setAdress_origin] = useState('');
  const [adress_destination, setAdress_destination] = useState('');
  const [customer_id, setCustomer_id] = useState('');
  const [loading, setLoading] = useState(false); 

  async function handleEstimateClick() {
    console.log("Estimando", adress_origin, adress_destination, "tipos", typeof (adress_origin), typeof (adress_destination));
    setLoading(true); 
    try {
      await onEstimateClick(adress_origin, adress_destination, customer_id); 
    } catch (error) {
      console.error("Erro ao estimar:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className="space-y-4 flex flex-col">
      <div>
        <label htmlFor="customer_id" className="block text-sm font-medium text-white">ID do Cliente</label>
        <input
          id="customer_id"
          name="customer_id"
          className="text-black bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCustomer_id(e.target.value)}
        />
      </div>

      
      <div>
        <label htmlFor="adress_origin" className="block text-sm font-medium text-white">Endereço de Origem</label>
        <input
          id="adress_origin"
          name="adress_origin"
          className="text-black bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAdress_origin(e.target.value)}
        />
       
      </div>

      <div>
        <label htmlFor="adress_destination" className="block text-sm font-medium text-white">Endereço de Destino</label>
        <input
          id="adress_destination"
          name="adress_destination"
          className="text-black bg-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAdress_destination(e.target.value)}
        />
      </div>

     
      <div className="flex justify-center">
        <button
          type="button" 
          onClick={handleEstimateClick} 
          className="w-1/2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 font-semibold mt-4"
          disabled={loading} 
        >
          {loading ? "Carregando..." : "Estimar"} 
        </button>
      </div>
    </form>
  );
}
