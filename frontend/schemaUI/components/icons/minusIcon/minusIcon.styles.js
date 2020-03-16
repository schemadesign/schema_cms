import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme, inverse) => ({
  fill: inverse ? theme.icon.fillInverse : theme.icon.fill,
  width: 30,
  height: 30,
  shapeRendering: 'crispEdges',
});
