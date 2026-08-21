import { useState, type ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DamageLevel, Sector, SupportPostType, Zone } from '@plataforma/shared';
import {
  Avatar,
  Badge,
  type BadgeStatus,
  Button,
  Chip,
  Icon,
  type IconName,
  Input,
  Select,
  Skeleton,
  Text,
} from '@/components/atoms';
import {
  BusinessCard,
  EmptyState,
  ErrorState,
  FilterBar,
  FormField,
  ProductCard,
  SupportPostCard,
} from '@/components/molecules';
import { BusinessList, RegisterBusinessForm, SupportPostForm } from '@/components/organisms';
import { colors, sectorLabels, spacing, zoneLabels } from '@/theme';
import type { Business, Product, SupportPost } from '@/lib/types';

const mockBusiness: Business = {
  id: '1',
  name: 'Panadería La Esperanza',
  zone: Zone.CUMANDAY,
  sector: Sector.ALIMENTOS_RESTAURANTES,
  damageLevel: DamageLevel.AFECTACION_LEVE,
  description: 'Pan artesanal, arepas y pandebonos hechos a diario. Vendemos por mayor y detal.',
  phone: '+573001234567',
  createdAt: new Date().toISOString(),
};

const mockBusiness2: Business = {
  id: '2',
  name: 'Ferretería San José',
  zone: Zone.SAN_JOSE,
  sector: Sector.FERRETERIA_CONSTRUCCION,
  damageLevel: DamageLevel.AFECTACION_MODERADA,
  description: 'Herramientas, materiales de construcción y asesoría para reparaciones.',
  phone: '+573007654321',
  createdAt: new Date().toISOString(),
};

const mockProduct: Product = {
  id: '1',
  businessId: '1',
  name: 'Pandebono x6',
  description: 'Recién horneados cada mañana. Disponibles hasta agotar existencias.',
  createdAt: new Date().toISOString(),
};

const mockPost: SupportPost = {
  id: '1',
  type: SupportPostType.OFREZCO,
  title: 'Presto herramientas',
  zone: Zone.PALOGRANDE,
  sector: null,
  description: 'Tengo un taladro y una sierra que puedo prestar para reparaciones de locales.',
  phone: '+573009876543',
  businessId: null,
  createdAt: new Date().toISOString(),
};

const zoneOptions = Object.values(Zone).map((zone) => ({ label: zoneLabels[zone], value: zone }));
const sectorOptions = Object.values(Sector)
  .slice(0, 6)
  .map((sector) => ({ label: sectorLabels[sector], value: sector }));

const iconNames: IconName[] = [
  'buscar',
  'filtro',
  'ubicacion',
  'telefono',
  'whatsapp',
  'agregar',
  'atras',
  'adelante',
  'cerrar',
  'ojo',
  'ojo-tachado',
  'escudo',
  'historial',
  'cerrar-sesion',
  'check',
  'alerta',
  'chevron-down',
];

const badgeStatuses: BadgeStatus[] = ['visible', 'en-revision', 'oculto'];

export default function ComponentGalleryScreen() {
  const [chipActive, setChipActive] = useState(true);
  const [zoneFilter, setZoneFilter] = useState<Zone | null>(null);
  const [sectorFilter, setSectorFilter] = useState<Sector | null>(null);
  const [selectValue, setSelectValue] = useState<Sector | null>(null);
  const [inputValue, setInputValue] = useState('');

  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text variant="display" style={styles.pageTitle}>
        Galería de componentes
      </Text>
      <Text variant="body" color={colors.textSecondary} style={styles.pageSubtitle}>
        Solo visible en desarrollo (__DEV__). Referencia viva del sistema de diseño.
      </Text>

      <Section title="Text">
        <Text variant="display">Barrio Activo</Text>
        <Text variant="heading">Panadería La Esperanza</Text>
        <Text variant="title">Muro de Apoyo</Text>
        <Text variant="body">Arreglos de ropa, uniformes y cortinas. Atención a domicilio disponible.</Text>
        <Text variant="label" color={colors.textSecondary}>Barrio o zona · Chipre · La Enea · Palermo</Text>
        <Text variant="caption" color={colors.textSecondary}>Hace 2 horas · Esta app no procesa pagos.</Text>
      </Section>

      <Section title="Button">
        <Row>
          <Cell label="Primario">
            <Button label="Buscar negocio" onPress={() => {}} />
          </Cell>
          <Cell label="Deshabilitado">
            <Button label="Buscar negocio" onPress={() => {}} disabled />
          </Cell>
          <Cell label="Cargando">
            <Button label="Buscando" onPress={() => {}} loading />
          </Cell>
        </Row>
        <Row>
          <Cell label="Secundario">
            <Button label="Ver directorio" variant="secondary" onPress={() => {}} />
          </Cell>
          <Cell label="WhatsApp">
            <Button label="Escribir por WhatsApp" variant="whatsapp" onPress={() => {}} />
          </Cell>
        </Row>
      </Section>

      <Section title="Input & Select">
        <FormField label="Nombre del negocio" helperText="Escríbelo tal como aparece en tu negocio.">
          <Input value={inputValue} onChangeText={setInputValue} placeholder="Ej: Panadería La Esperanza" />
        </FormField>
        <FormField label="Número de WhatsApp" error="Ingresa 10 dígitos sin espacios.">
          <Input value="123" error editable={false} />
        </FormField>
        <FormField label="Tipo de negocio" helperText="Elige el que mejor describe tu negocio.">
          <Select value={selectValue} options={sectorOptions} onChange={setSelectValue} placeholder="Selecciona un tipo" />
        </FormField>
      </Section>

      <Section title="Chip">
        <View style={styles.rowWrap}>
          <Chip label="Activo (toca para alternar)" active={chipActive} onPress={() => setChipActive((v) => !v)} />
          <Chip label="Inactivo" active={false} onPress={() => {}} />
        </View>
      </Section>

      <Section title="FilterBar">
        <FilterBar options={zoneOptions.slice(0, 6)} value={zoneFilter} onChange={setZoneFilter} allLabel="Todas las zonas" />
        <View style={{ height: spacing[2] }} />
        <FilterBar options={sectorOptions} value={sectorFilter} onChange={setSectorFilter} />
      </Section>

      <Section title="Badge">
        <View style={styles.rowWrap}>
          {badgeStatuses.map((status) => (
            <Badge key={status} status={status} />
          ))}
        </View>
      </Section>

      <Section title="Avatar">
        <View style={styles.rowWrap}>
          <Avatar name="Panadería La Esperanza" />
          <Avatar name="Ferretería San José" size={32} />
          <Avatar name="A" size={56} />
        </View>
      </Section>

      <Section title="Skeleton">
        <View style={{ gap: spacing[2] }}>
          <Skeleton width="75%" height={14} />
          <Skeleton width="50%" height={11} />
          <Skeleton width="100%" height={11} />
        </View>
      </Section>

      <Section title="Icon">
        <View style={styles.iconGrid}>
          {iconNames.map((name) => (
            <View key={name} style={styles.iconCell}>
              <Icon name={name} />
              <Text variant="caption" color={colors.textSecondary} style={styles.iconLabel}>
                {name}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="EmptyState / ErrorState">
        <EmptyState title="Sin resultados" description="Intenta con otro barrio o tipo de negocio." actionLabel="Ver todos" onAction={() => {}} />
        <View style={{ height: spacing[3] }} />
        <ErrorState onRetry={() => {}} />
      </Section>

      <Section title="BusinessCard / ProductCard / SupportPostCard">
        <BusinessCard business={mockBusiness} onPress={() => {}} />
        <View style={{ height: spacing[3] }} />
        <ProductCard product={mockProduct} />
        <View style={{ height: spacing[3] }} />
        <SupportPostCard post={mockPost} />
      </Section>

      <Section title="BusinessList (organismo)">
        <View style={styles.listDemo}>
          <BusinessList data={[mockBusiness, mockBusiness2]} onSelectBusiness={() => {}} />
        </View>
      </Section>

      <Section title="RegisterBusinessForm (organismo)">
        <RegisterBusinessForm onSubmit={(values) => console.log('RegisterBusinessForm', values)} />
      </Section>

      <Section title="SupportPostForm (organismo)">
        <SupportPostForm onSubmit={(values) => console.log('SupportPostForm', values)} />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="title" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.cell}>
      <Text variant="caption" color={colors.textSecondary} style={styles.cellLabel}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[16],
    gap: spacing[3],
  },
  pageTitle: {
    marginBottom: spacing[1],
  },
  pageSubtitle: {
    marginBottom: spacing[4],
  },
  section: {
    marginBottom: spacing[8],
    gap: spacing[3],
  },
  sectionTitle: {
    marginBottom: spacing[1],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    gap: spacing[2],
  },
  cellLabel: {
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  iconCell: {
    width: 72,
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  iconLabel: {
    textAlign: 'center',
  },
  listDemo: {
    minHeight: 260,
  },
});
