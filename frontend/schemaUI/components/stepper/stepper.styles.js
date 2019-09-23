import { light } from '../../utils/theme';

export const getStyles = (theme = light) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
  },
  dotStyles: {
    width: '12px',
    height: '12px',
    backgroundColor: theme.stepper.background,
    display: 'block',
    borderRadius: '50%',
    margin: '0 4px',
    cursor: 'pointer',
  },
  dotActiveStyles: {
    backgroundColor: theme.stepper.active,
    cursor: 'default',
    pointerEvents: 'none',
  },
});
