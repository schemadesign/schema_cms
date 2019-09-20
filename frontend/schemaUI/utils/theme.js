const colors = {
  body: '#FFF',
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
    background: colors.background,
    text: colors.text,
  },
  card: {
    label: colors.label,
    border: colors.border,
    background: colors.background,
  },
  body: '#FFF',
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
  body: '#000',
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

export { light, dark };
export const Theme = { light, dark };
