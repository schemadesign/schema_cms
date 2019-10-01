import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme, inverse) => ({
  fill: inverse ? theme.icon.fillInverse : theme.icon.fill,
  width: '60px',
  height: '60px',
});
