import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from './lib/appkit';
import { Header } from './layout/Header';
import { Tabs } from './components/tabs/Tabs';
import { Toaster } from '@/components/ui/sonner';
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" theme="dark" />
        <Header />
        <Tabs />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
