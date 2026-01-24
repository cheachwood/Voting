import { VotersTab } from './VotersTab';
import ProposalsTab from './ProposalsTab';
import VoteTab from './VoteTab';
import { WorkflowTab } from './WorkflowTab';
import { ResultsTab } from './ResultsTab';
import { WorkflowStatusValues } from '.';
import { useVotingContract } from '../hooks/useVotingContract';

export const Tabs = () => {
  const { wfStatus, isOwner, clientAddress, activeTab, setActiveTab } = useVotingContract();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Statut du Workflow</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Phase actuelle</p>
            <p className="text-xl font-bold text-gray-900">
              {wfStatus === 0 && 'Enregistrement des électeurs'}
              {wfStatus === 1 && 'Début des propositions'}
              {wfStatus === 2 && 'Fin des propositions'}
              {wfStatus === 3 && 'Vote des propositions'}
              {wfStatus === 4 && 'Fin des votes des propositions'}
              {wfStatus === 5 && 'Dépouillement'}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {isOwner && (
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'voters' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('voters')}
              >
                Votants
              </button>
            )}
            {wfStatus === WorkflowStatusValues.ProposalsRegistrationStarted && (
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'proposals' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('proposals')}
              >
                Propositions
              </button>
            )}
            {wfStatus === WorkflowStatusValues.VotingSessionStarted && (
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'vote' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('vote')}
              >
                Voter
              </button>
            )}
            {isOwner && (
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'workflow' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('workflow')}
              >
                Workflow
              </button>
            )}
            {wfStatus === WorkflowStatusValues.VotesTallied && (
              <button
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab('results')}
              >
                Résultats
              </button>
            )}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'voters' && isOwner && (
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
              <VoteTab key={clientAddress} />
            </div>
          )}
          {activeTab === 'workflow' && isOwner && (
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
