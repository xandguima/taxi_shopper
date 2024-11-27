export interface ErrorRequest {
  details: DetailsProps[]
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
  errorRequest: ErrorRequest;
  onClose: () => void;
}
export function Modal({ errorRequest, onClose }: ModalProps) {

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-gray-900 p-6 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-2xl text-red-500 font-bold text-center mb-4">ERRO:</h2>


        <p><strong className="text-red-500">Descrição:</strong> {errorRequest.error_description}</p>
        {
          Array.isArray(errorRequest.details) ? (
            errorRequest.details && errorRequest.details.map((detail, index) => (
              <div key={index}>
                <p><strong className="text-red-500">Código:</strong> {detail.code}</p>
                <p><strong className="text-red-500">Campo:</strong> {detail.path.join('.')}</p>
                <p><strong className="text-red-500">Recebido:</strong> {detail.received}</p>
                <p><strong className="text-red-500">Esperado:</strong> {detail.expected}</p>
                <p><strong className="text-red-500">Mensagem:</strong> {detail.message}</p>
              </div>
            ))
          ) : (
            <p><strong className="text-red-500">Detalhes:</strong> {errorRequest.details}</p>
          )
        }

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