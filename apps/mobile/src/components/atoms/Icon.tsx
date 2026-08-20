import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';
import { colors } from '@/theme';

export type IconName =
  | 'buscar'
  | 'filtro'
  | 'chevron-down'
  | 'ubicacion'
  | 'telefono'
  | 'whatsapp'
  | 'agregar'
  | 'atras'
  | 'adelante'
  | 'cerrar'
  | 'ojo'
  | 'ojo-tachado'
  | 'escudo'
  | 'historial'
  | 'cerrar-sesion'
  | 'check'
  | 'alerta';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

const strokeProps = {
  fill: 'none' as const,
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function Icon({ name, size = 24, color = colors.text }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderIcon(name, color)}
    </Svg>
  );
}

function renderIcon(name: IconName, color: string) {
  switch (name) {
    case 'buscar':
      return (
        <>
          <Circle cx={11} cy={11} r={8} stroke={color} {...strokeProps} />
          <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={color} {...strokeProps} />
        </>
      );
    case 'chevron-down':
      return <Polyline points="6 9 12 15 18 9" stroke={color} {...strokeProps} />;
    case 'filtro':
      return (
        <Polygon
          points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
          stroke={color}
          {...strokeProps}
        />
      );
    case 'ubicacion':
      return (
        <>
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} {...strokeProps} />
          <Circle cx={12} cy={10} r={3} stroke={color} {...strokeProps} />
        </>
      );
    case 'telefono':
      return (
        <Path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.07-1.07a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          stroke={color}
          {...strokeProps}
        />
      );
    case 'whatsapp':
      return (
        <Path
          fill={color}
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        />
      );
    case 'agregar':
      return (
        <>
          <Line x1={12} y1={5} x2={12} y2={19} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
          <Line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
        </>
      );
    case 'atras':
      return <Polyline points="15 18 9 12 15 6" stroke={color} {...strokeProps} />;
    case 'adelante':
      return <Polyline points="9 6 15 12 9 18" stroke={color} {...strokeProps} />;
    case 'cerrar':
      return (
        <>
          <Line x1={18} y1={6} x2={6} y2={18} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
          <Line x1={6} y1={6} x2={18} y2={18} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
        </>
      );
    case 'ojo':
      return (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} {...strokeProps} />
          <Circle cx={12} cy={12} r={3} stroke={color} {...strokeProps} />
        </>
      );
    case 'ojo-tachado':
      return (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke={color} {...strokeProps} />
          <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke={color} {...strokeProps} />
          <Line x1={1} y1={1} x2={23} y2={23} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
        </>
      );
    case 'escudo':
      return <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} {...strokeProps} />;
    case 'historial':
      return (
        <>
          <Circle cx={12} cy={12} r={10} stroke={color} {...strokeProps} />
          <Polyline points="12 6 12 12 16 14" stroke={color} {...strokeProps} />
        </>
      );
    case 'cerrar-sesion':
      return (
        <>
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} {...strokeProps} />
          <Polyline points="16 17 21 12 16 7" stroke={color} {...strokeProps} />
          <Line x1={21} y1={12} x2={9} y2={12} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
        </>
      );
    case 'check':
      return <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
    case 'alerta':
      return (
        <>
          <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2.5} />
          <Line x1={12} y1={8} x2={12} y2={12} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          <Line x1={12} y1={16} x2={12.01} y2={16} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </>
      );
  }
}
