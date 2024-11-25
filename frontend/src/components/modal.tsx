export interface ErrorRequestEstimate {
  details:string
  error_code: string
  error_description: string

}

type ModalProps = {
  errorRequestEstimate: ErrorRequestEstimate;
  onClose: () => void;
}
export function Modal({ errorRequestEstimate, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-gray-900 p-6 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-lg text-red-500 font-bold">{errorRequestEstimate.error_code}</h2>
        <p><strong className="text-red-500">Descrição:</strong> {errorRequestEstimate.error_description}</p>
        <p><strong className="text-red-500">Detalhes:</strong> {errorRequestEstimate.details}</p>
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