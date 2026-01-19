export const ResultsTab = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Résultats du vote</h3>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center">
        <p className="text-sm text-yellow-800 mb-2">🏆 Proposition gagnante</p>
        <p className="text-xl font-bold text-gray-900 mb-1">ID 1 - Augmenter le budget marketing</p>
        <p className="text-2xl font-bold text-yellow-600">3 votes</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-yellow-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">1</td>
              <td className="px-6 py-4 text-sm text-gray-900">Augmenter le budget marketing</td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">3</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Gagnant</span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">2</td>
              <td className="px-6 py-4 text-sm text-gray-900">Développer une app mobile</td>
              <td className="px-6 py-4 text-sm text-gray-900">2</td>
              <td className="px-6 py-4 text-sm text-gray-500">-</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">0</td>
              <td className="px-6 py-4 text-sm text-gray-900">GENESIS</td>
              <td className="px-6 py-4 text-sm text-gray-900">0</td>
              <td className="px-6 py-4 text-sm text-gray-500">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
