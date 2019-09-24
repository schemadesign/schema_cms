import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${theme.checkbox.border}`,
});
