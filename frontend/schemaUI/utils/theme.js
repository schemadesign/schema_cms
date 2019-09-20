const primary = {
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

const secondary = {
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
    color: primary.label,
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

primary.typography = primaryTypography;

export { primary, secondary };
export const Theme = { primary, secondary };
