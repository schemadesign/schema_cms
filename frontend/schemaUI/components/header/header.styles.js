import { defaultTheme } from '../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    color: theme.header.text,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: '18px',
  },
  buttonStyles: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 6,
    right: 0,
  },
});
