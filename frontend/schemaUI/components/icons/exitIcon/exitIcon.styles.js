import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  border: `solid 1px ${theme.icon.fill}`,
  width: '15px',
  height: '20px',
});
