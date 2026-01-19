import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from './lib/appkit';
import { Header } from './layout/Header';
import { Tabs } from './components/tabs/Tabs';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Tabs />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
