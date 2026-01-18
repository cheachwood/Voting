import type { WorkflowCardProps } from '.';

export const WorkflowCard = ({ title, description, isAvailable, onAction, buttonLabel, buttonColor = 'blue' }: WorkflowCardProps) => {
  const buttonClass = buttonColor === 'red' ? 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700' : 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700';

  const disabledButtonClass = 'px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed';

  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${!isAvailable && 'opacity-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{isAvailable ? 'Disponible' : 'Non disponible'}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <button className={isAvailable ? buttonClass : disabledButtonClass} onClick={onAction} disabled={!isAvailable}>
        {buttonLabel}
      </button>
    </div>
  );
};
