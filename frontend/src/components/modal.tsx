export interface ErrorRequest {
  details?: DetailsProps[]
  error_code: string
  error_description: string
}
interface DetailsProps {
  code: string
  expected: string
  message: string
  path: string[]
  received: string;
}


type ModalProps = {
  errorMessage: string;
  errorDetails?: string;
  onClose: () => void;
}

export function Modal({ errorMessage, errorDetails, onClose }: ModalProps) {

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-gray-900 p-6 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-2xl text-red-500 font-bold text-center mb-4">ERRO:</h2>

        <p><strong className="text-red-500">Mensagem:</strong> {errorMessage}</p>
        
       
        {errorDetails && (
          <p><strong className="text-red-500">Detalhes:</strong> {errorDetails}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
