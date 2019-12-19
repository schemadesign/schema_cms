import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme) => ({
  containerStyles: {
    border: `2px dashed ${theme.border}`,
    width: '100%',
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'copy',
    textAlign: 'center',
    borderRadius: 10,
    lineHeight: '50px',
  },
  hiddenStyles: {
    position: 'absolute',
    top: 5,
    left: 0,
    height: 'calc(100% - 10px)',
    background: theme.background,
    transition: 'opacity 200ms ease-in-out',
    opacity: 0,
    visibility: 'hidden',
  },
});
