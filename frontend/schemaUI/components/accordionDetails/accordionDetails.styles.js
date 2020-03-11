import { defaultTheme } from '../../utils/theme';

const TIMING_FUNCTION = 'linear';
export const ANIMATION_DURATION = 200;

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    transition: `height ${ANIMATION_DURATION}ms ${TIMING_FUNCTION}, overflow 0s ${TIMING_FUNCTION} ${ANIMATION_DURATION}ms`,
    backgroundColor: theme.background,
  },
});
