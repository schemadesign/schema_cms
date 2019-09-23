const colors = {
  white: '#FFF',
  black: '#000',
  darkGrey: '#1d1d20',
  lightGrey: '#71737e',
  veryLightPink: '#f0efef',
  coolGray: '#a6a7aa',
  body: '#FFF',
  bodyDark: '#000',
  background: '#f0efef',
  label: '#a6a7aa',
  border: '#1d1d20',
  text: '#1d1d20',
  error: '#f21e29',
  active: '#1d1d20',
  divider: '#F0EFEF',
  iconDark: '#1d1d20',
  iconBright: '#FFF',
};

const light = {
  button: {
    background: colors.black,
    text: colors.white,
  },
  card: {
    label: colors.lightGrey,
    text: colors.white,
    border: colors.white,
    background: colors.background,
  },
  providerContainer: {
    backgroundColor: colors.body,
    minHeight: '100vh',
  },
  dataGrid: {
    background: colors.veryLightPink,
    text: colors.coolGray,
  },
  background: '#f0efef',
  label: '#a6a7aa',
  border: '#1d1d20',
  text: '#1d1d20',
  error: '#f21e29',
  active: '#1d1d20',
  divider: '#F0EFEF',
  iconDark: '#1d1d20',
  iconBright: '#FFF',
  icon: {
    dark: '#1d1d20',
    light: '#FFF',
  },
};

const dark = {
  button: {
    background: colors.white,
    text: colors.black,
  },
  card: {
    label: colors.label,
    border: colors.border,
    background: colors.darkGrey,
  },
  providerContainer: {
    backgroundColor: colors.bodyDark,
    minHeight: '100vh',
  },
  dataGrid: {
    background: colors.black,
    text: colors.lightGrey,
  },
  background: '#1d1d20',
  text: '#fff',
  label: '#71737e',
  error: '#f21e29',
  active: '#1d1d20',
  divider: '#F0EFEF',
  iconDark: '#1d1d20',
  iconBright: '#FFF',
};

const INTER_FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONOSPACE_FONT = 'Hack, monospace';

const primaryTypography = {
  h1: {
    fontFamily: INTER_FONT,
    fontWeight: 600,
  },
  h2: {
    fontFamily: INTER_FONT,
    fontWeight: 100,
  },
  h3: {
    fontFamily: INTER_FONT,
    fontWeight: 600,
    color: light.label,
  },
  p: {
    fontFamily: INTER_FONT,
    fontWeight: 200,
  },
  pre: {
    fontFamily: MONOSPACE_FONT,
  },
  span: {
    fontFamily: INTER_FONT,
  },
};

light.typography = primaryTypography;
dark.typography = primaryTypography;

export { light, dark, colors };
export const Theme = { light, dark, colors };
