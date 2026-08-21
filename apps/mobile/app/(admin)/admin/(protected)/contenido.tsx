import { View } from 'react-native';
import { AdminContentList } from '@/components/organisms';
import { colors } from '@/theme';

export default function AdminContenidoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AdminContentList />
    </View>
  );
}
