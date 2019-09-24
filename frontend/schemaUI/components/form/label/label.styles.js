import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  border: 'none',
  outline: 'none',
  color: theme.label.text,
  fontSize: '14px',
  borderTop: `1px solid ${theme.label.border}`,
  paddingTop: '8px',
  display: 'block',
  width: '100%',
});
