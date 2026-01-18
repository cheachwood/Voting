import { useState } from 'react';

export const ProposalsTab = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Propositions</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2"> Soumettre une proposition </label>
        <textarea
          rows={3}
          placeholder="Description de votre proposition..."
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        ></textarea>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Soumettre</button>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 mb-2">Liste des propositions</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">0</td>
              <td className="px-6 py-4 text-sm text-gray-900">GENESIS</td>
              <td className="px-6 py-4 text-sm text-gray-500">0</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">1</td>
              <td className="px-6 py-4 text-sm text-gray-900">Augmenter le budget marketing</td>
              <td className="px-6 py-4 text-sm text-gray-500">3</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">2</td>
              <td className="px-6 py-4 text-sm text-gray-900">Développer une app mobile</td>
              <td className="px-6 py-4 text-sm text-gray-500">2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalsTab;
