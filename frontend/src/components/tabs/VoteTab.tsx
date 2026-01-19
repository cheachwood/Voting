import { useState } from 'react';

export const VoteTab = () => {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Voter</h3>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Vos informations</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Statut</p>
            <p className="font-medium text-gray-900">Enregistré ✓</p>
          </div>
          <div>
            <p className="text-gray-600">A voté</p>
            <p className="font-medium text-gray-900">Non</p>
          </div>
          <div>
            <p className="text-gray-600">Vote pour</p>
            <p className="font-medium text-gray-900">-</p>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-3">Sélectionnez une proposition</h4>
      <div className="space-y-3 mb-6">
        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="vote" value={0} checked={selectedProposal === 0} onChange={() => setSelectedProposal(0)} className="mr-3" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">ID 0 - GENESIS</p>
            <p className="text-sm text-gray-500">Proposition initiale du système</p>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="vote" value={1} checked={selectedProposal === 1} onChange={() => setSelectedProposal(1)} className="mr-3" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">ID 1 - Augmenter le budget marketing</p>
            <p className="text-sm text-gray-500">Améliorer la visibilité du projet</p>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input type="radio" name="vote" value={2} checked={selectedProposal === 2} onChange={() => setSelectedProposal(2)} className="mr-3" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">ID 2 - Développer une app mobile</p>
            <p className="text-sm text-gray-500">Version iOS et Android</p>
          </div>
        </label>
      </div>

      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Confirmer mon vote</button>
    </div>
  );
};

export default VoteTab;
