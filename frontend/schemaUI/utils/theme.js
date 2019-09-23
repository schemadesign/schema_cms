const colors = {
  white: '#FFF',
  black: '#000',
  darkGrey: '#1d1d20',
  lightGrey: '#71737e',
  veryLightPink: '#f0efef',
  coolGray: '#a6a7aa',
  mediumGray: '#2F2F36',
  red: '#f21e29',
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
  checkbox: {
    border: colors.mediumGray,
    text: colors.black,
  },
  input: {
    text: colors.black,
  },
  label: {
    text: colors.coolGray,
    border: colors.darkGrey,
  },
  textArea: {
    text: colors.black,
  },
  textField: {
    label: colors.coolGray,
    error: colors.red,
  },
  header: {
    text: colors.white,
  },
  menu: {
    background: colors.white,
    text: colors.black,
  },
  stepper: {
    background: colors.veryLightPink,
    active: colors.darkGrey,
  },
  icon: {
    fill: colors.darkGrey,
  },
  background: '#f0efef',
  border: '#1d1d20',
  text: '#1d1d20',
  error: '#f21e29',
  active: '#1d1d20',
  divider: '#F0EFEF',
  iconDark: '#1d1d20',
  iconBright: '#FFF',
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
  checkbox: {
    border: colors.mediumGray,
    text: colors.white,
  },
  input: {
    text: colors.white,
  },
  label: {
    text: colors.lightGrey,
    border: colors.mediumGray,
  },
  textArea: {
    text: colors.white,
  },
  textField: {
    label: colors.lightGrey,
    error: colors.red,
  },
  header: {
    text: colors.white,
  },
  menu: {
    background: colors.black,
    text: colors.white,
  },
  stepper: {
    background: colors.darkGrey,
    active: colors.white,
  },
  icon: {
    fill: colors.white,
  },
  background: '#1d1d20',
  text: '#fff',
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
