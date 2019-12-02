import { BUTTON, INVERSE_BUTTON, BUTTON_DISABLED } from '../components/button/button.constants';

const colors = {
  white: '#FFF',
  black: '#000',
  darkGrey: '#1d1d20',
  lightGrey: '#71737e',
  veryLightPink: '#f0efef',
  coolGray: '#a6a7aa',
  mediumGray: '#2F2F36',
  red: '#f21e29',
};

const light = {
  [BUTTON]: {
    background: colors.veryLightPink,
    text: colors.black,
  },
  [INVERSE_BUTTON]: {
    background: colors.black,
    text: colors.white,
  },
  [BUTTON_DISABLED]: {
    background: colors.veryLightPink,
    text: colors.coolGray,
  },
  card: {
    label: colors.coolGray,
    border: colors.black,
    background: colors.veryLightPink,
    text: colors.black,
  },
  providerContainer: {
    backgroundColor: colors.white,
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
    border: colors.veryLightPink,
  },
  textArea: {
    text: colors.black,
  },
  textField: {
    label: colors.coolGray,
    error: colors.red,
  },
  header: {
    text: colors.darkGrey,
    border: colors.veryLightPink,
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
    background: colors.veryLightPink,
    fill: colors.darkGrey,
    fillInverse: colors.white,
  },
  radioButton: {
    text: colors.darkGrey,
    border: colors.darkGrey,
    active: {
      background: colors.darkGrey,
      fill: colors.white,
    },
    unActive: {
      background: colors.veryLightPink,
      fill: colors.white,
    },
  },
  table: {
    border: {
      body: colors.veryLightPink,
      header: colors.white,
    },
    background: {
      body: colors.white,
      header: colors.veryLightPink,
    },
    text: {
      body: colors.black,
      header: colors.coolGray,
    },
  },
  tab: {
    normal: colors.veryLightPink,
    active: colors.black,
    hover: colors.black,
  },
  select: {
    background: colors.veryLightPink,
    border: colors.white,
  },
  background: colors.white,
  border: colors.veryLightPink,
  text: colors.darkGrey,
  secondaryText: colors.coolGray,
  error: colors.red,
  colors,
};

const dark = {
  [BUTTON]: {
    background: colors.darkGrey,
    text: colors.white,
  },
  [INVERSE_BUTTON]: {
    background: colors.white,
    text: colors.black,
  },
  [BUTTON_DISABLED]: {
    background: colors.darkGrey,
    text: colors.lightGrey,
  },
  card: {
    label: colors.lightGrey,
    border: colors.white,
    background: colors.darkGrey,
    text: colors.white,
  },
  providerContainer: {
    backgroundColor: colors.black,
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
    background: colors.black,
  },
  textField: {
    label: colors.lightGrey,
    error: colors.red,
  },
  header: {
    text: colors.white,
    border: colors.mediumGray,
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
    background: colors.darkGrey,
    fill: colors.white,
    fillInverse: colors.black,
  },
  radioButton: {
    text: colors.white,
    border: colors.white,
    active: {
      background: colors.white,
      fill: colors.darkGrey,
    },
    unActive: {
      background: colors.darkGrey,
      fill: colors.white,
      dot: colors.white,
    },
  },
  table: {
    border: {
      body: colors.darkGrey,
      header: colors.black,
    },
    background: {
      body: colors.black,
      header: colors.darkGrey,
    },
    text: {
      body: colors.white,
      header: colors.lightGrey,
    },
  },
  tab: {
    normal: colors.mediumGray,
    active: colors.white,
    hover: colors.white,
  },
  select: {
    background: colors.darkGrey,
    border: colors.black,
  },
  background: colors.black,
  text: colors.white,
  border: colors.mediumGray,
  secondaryText: colors.lightGrey,
  error: colors.red,
  colors,
};

const INTER_FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONOSPACE_FONT = 'Hack, monospace';

const typography = {
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

light.typography = typography;
dark.typography = typography;

const defaultTheme = dark;

export { light, dark, colors, defaultTheme };
export const Theme = { light, dark, colors };
