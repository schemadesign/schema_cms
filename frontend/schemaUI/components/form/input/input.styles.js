import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  border: 'none',
  outline: 'none',
  color: theme.input.text,
  fontSize: '18px',
  lineHeight: '24px',
  backgroundColor: 'transparent',
});
