import { ImageSourcePropType } from 'react-native';

const CIRCUIT_IMAGES = {
  sepang: require('../assets/circuitos/sepang1.webp'),
  brasil: require('../assets/circuitos/brasil1.jpg'),
  qatar: require('../assets/circuitos/qatar1.webp'),
  abuDhabi: require('../assets/circuitos/abudhabi1.webp'),
  mexico: require('../assets/circuitos/mexico1.png'),
  singapura: require('../assets/circuitos/singapura1.webp'),
  texas: require('../assets/circuitos/texas1.webp'),
  vegas: require('../assets/circuitos/vegas1.webp'),
} satisfies Record<string, ImageSourcePropType>;

const CIRCUIT_DETAIL_IMAGES = {
  sepang: require('../assets/circuitos/sepang2.webp'),
  brasil: require('../assets/circuitos/brasil2.png'),
  qatar: require('../assets/circuitos/qatar2.png'),
  abuDhabi: require('../assets/circuitos/abudhab2.png'),
  mexico: require('../assets/circuitos/mexico2.png'),
  singapura: require('../assets/circuitos/singapura2.png'),
  texas: require('../assets/circuitos/texas2.png'),
  vegas: require('../assets/circuitos/vegas2.png'),
} satisfies Record<string, ImageSourcePropType>;

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getCircuitImageFromMap(
  images: Record<string, ImageSourcePropType>,
  ...values: Array<string | undefined>
): ImageSourcePropType {
  const text = values.filter(Boolean).map((value) => normalize(value as string)).join(' ');

  if (text.includes('malaysia') || text.includes('malasia') || text.includes('sepang')) return images.sepang;
  if (text.includes('brasil') || text.includes('brazil') || text.includes('interlagos')) return images.brasil;
  if (text.includes('catar') || text.includes('qatar') || text.includes('losail')) return images.qatar;
  if (text.includes('abu dhabi') || text.includes('yas marina')) return images.abuDhabi;
  if (text.includes('mexico') || text.includes('hermanos rodriguez')) return images.mexico;
  if (text.includes('singapura') || text.includes('singapore') || text.includes('marina bay')) return images.singapura;
  if (text.includes('estados unidos') || text.includes('united states') || text.includes('texas') || text.includes('austin') || text.includes('americas')) return images.texas;
  if (text.includes('las vegas') || text.includes('vegas')) return images.vegas;

  return images.sepang;
}

export function getCircuitImage(...values: Array<string | undefined>): ImageSourcePropType {
  return getCircuitImageFromMap(CIRCUIT_IMAGES, ...values);
}

export function getCircuitDetailImage(...values: Array<string | undefined>): ImageSourcePropType {
  return getCircuitImageFromMap(CIRCUIT_DETAIL_IMAGES, ...values);
}
