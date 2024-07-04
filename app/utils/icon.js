export const ICONS = [
  // { label: '', icon:  },
];

export const getIconFromLabel = (label) => ICONS.find((i) => i.label === label)?.icon;
