import { defaultTheme } from '../../../utils/theme';

export const getStyles = (theme = defaultTheme, active = false) => ({
  switchStyles: {
    background: active ? theme.switch.backgroundActive : theme.switch.background,
    width: 44,
    height: 24,
    borderRadius: 20,
    padding: 2,
    transition: 'background 200ms ease-in-out',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  circleStyles: {
    background: theme.switch.circle,
    transform: `translateX(${active ? '20px' : '0'})`,
    width: 20,
    height: 20,
    borderRadius: '50%',
    transition: 'transform 200ms ease-in-out',
  },
  labelStyles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  inputStyles: {
    visibility: 'hidden',
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
  },
});
