import { StatusBar } from 'expo-status-bar';
import { ContextProvider } from './app/config/Context';
import Index from './app/screens/Index';

export default function App() {
  return (
    <ContextProvider>
      <Index />
      <StatusBar style='light' />
    </ContextProvider>
  );
}
