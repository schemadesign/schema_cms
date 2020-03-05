import { defaultTheme } from '../../utils/theme';

export const getStyles = ({ open, theme = defaultTheme }) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    position: 'relative',
    paddingRight: 40,
    backgroundColor: theme.background,
  },
  iconContainerStyles: {
    cursor: 'pointer',
    transition: 'transform 200ms ease-in-out',
    transformOrigin: 'center center',
    fontSize: 0,
    transform: `rotate(${open ? 180 : 0}deg)`,
    position: 'absolute',
    right: 0,
    top: 9,
  },
});
