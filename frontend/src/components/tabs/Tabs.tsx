import { useState } from 'react';
import { VotersTab } from './VotersTab';
import ProposalsTab from './ProposalsTab';
import VoteTab from './VoteTab';
import { WorkflowTab } from './WorkflowTab';
import { ResultsTab } from './ResultsTab';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('voters');

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Statut du Workflow</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Phase actuelle</p>
            <p className="text-xl font-bold text-gray-900">RegisteringVoters</p>
          </div>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">Actif</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'voters' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('voters')}
            >
              Votants
            </button>

            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'proposals' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('proposals')}
            >
              Propositions
            </button>

            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'vote' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('vote')}
            >
              Voter
            </button>

            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'workflow' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('workflow')}
            >
              Workflow
            </button>

            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('results')}
            >
              Résultats
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'voters' && (
            <div>
              <VotersTab />
            </div>
          )}
          {activeTab === 'proposals' && (
            <div>
              <ProposalsTab />
            </div>
          )}
          {activeTab === 'vote' && (
            <div>
              <VoteTab />
            </div>
          )}
          {activeTab === 'workflow' && (
            <div>
              <WorkflowTab />
            </div>
          )}
          {activeTab === 'results' && (
            <div>
              <ResultsTab />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
