import { light } from '../../../utils/theme';

export const getStyles = (theme = light) => ({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${theme.checkbox.border}`,
});
