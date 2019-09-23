import { light } from '../../../utils/theme';

export const getStyles = (theme = light) => ({
  border: 'none',
  outline: 'none',
  color: theme.input.text,
  fontSize: '18px',
  lineHeight: '24px',
  backgroundColor: 'transparent',
});
