import type { HeaderProps } from './index';

export const Header = ({ isOwner }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Gauche : Titre */}
          <h1 className='text-2xl font-bold text-gray-900"'>Voting DApp</h1>

          {/* Droite : Wallet + Badge */}
          <div className="flex items-center space-x-4">
            <appkit-button />
            {isOwner && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Owner</span>}
          </div>
        </div>
      </div>
    </header>
  );
};
