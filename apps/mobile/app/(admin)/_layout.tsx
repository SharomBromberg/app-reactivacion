import Head from 'expo-router/head';
import { Stack } from 'expo-router';
import { AdminAuthProvider } from '@/features/admin/authContext';

// Grupo puramente organizativo: agrupa /admin/* bajo un mismo layout
// (sesión + noindex) sin afectar las URLs reales (esas las da la carpeta
// admin/ de adentro). No se enlaza desde ninguna pantalla pública.
export default function AdminGroupLayout() {
  return (
    <AdminAuthProvider>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminAuthProvider>
  );
}
