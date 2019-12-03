import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  fill: theme.icon.fill,
  stroke: theme.icon.fillInverse,
  width: '60px',
  height: '60px',
});
