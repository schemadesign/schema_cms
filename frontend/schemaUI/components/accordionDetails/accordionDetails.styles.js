import { defaultTheme } from '../../utils/theme';

const TIMING_FUNCTION = 'linear';
export const ANIMATION_DURATION = 300;

export const getStyles = ({ theme = defaultTheme, transitionProperty }) => ({
  containerStyles: {
    transition: `${transitionProperty} ${ANIMATION_DURATION}ms ${TIMING_FUNCTION}, transform ${ANIMATION_DURATION}ms ${TIMING_FUNCTION}`,
    marginBottom: 10,
    backgroundColor: theme.background,
    transform: 'scaleY(0)',
    transformOrigin: 'top',
  },
});
