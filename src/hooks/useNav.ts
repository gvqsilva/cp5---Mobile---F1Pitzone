import { useNavigation } from '@react-navigation/native';

// Tipagem solta de propósito; dá para tipar com RootStackParamList depois.
export default function useNav() {
  return useNavigation<any>();
}
