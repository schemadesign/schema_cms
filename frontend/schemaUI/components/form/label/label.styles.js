import { light } from '../../../utils/theme';

export const getStyles = (theme = light) => ({
  border: 'none',
  outline: 'none',
  color: theme.label.text,
  fontSize: '14px',
  borderTop: `1px solid ${theme.label.border}`,
  paddingTop: '8px',
  display: 'block',
  width: '100%',
});
