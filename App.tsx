import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProgressProvider } from './src/context/UserProgressContext';

export default function App() {
  return (
    <UserProgressProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </UserProgressProvider>
  );
}
