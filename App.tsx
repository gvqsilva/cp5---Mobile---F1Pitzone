import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <StatusBar style="light" />
      <Navigation />
    </CartProvider>
  );
}
