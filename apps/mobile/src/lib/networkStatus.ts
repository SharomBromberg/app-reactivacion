import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/** Conecta el estado de red del dispositivo con TanStack Query (refetch al reconectar). */
export function setupOnlineManager(): void {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(state.isConnected === true);
    });
  });
}
