import { defaultTheme } from '../../utils/theme';

export const getStyles = ({ theme = defaultTheme, isDesktop }) => ({
  containerStyles: {
    backgroundColor: theme.menu.background,
    color: theme.menu.text,
    position: 'fixed',
    top: 0,
    bottom: isDesktop ? 'auto' : 0,
    right: 0,
    width: '100%',
    maxWidth: '360px',
    padding: '18px 20px 27px',
    transition: 'transform 400ms cubic-bezier(0.86, 0, 0.07, 1), visibility 0s linear 400ms',
    textAlign: 'left',
  },
  closeButtonStyles: {
    position: 'absolute',
    top: '6px',
    right: 0,
  },
  showStyles: {
    visibility: 1,
  },
  hideStyles: {
    visibility: 0,
    transform: 'translateX(100%)',
  },
});
