import LogoLarge from '../components/icons/company/logoLarge';

export const ICONS = [{ label: 'LogoLarge', icon: LogoLarge }];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
