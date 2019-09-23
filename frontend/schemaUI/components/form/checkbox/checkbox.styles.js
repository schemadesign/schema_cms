import { light } from '../../../utils/theme';

export const getStyles = (theme = light) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    color: theme.checkbox.text,
    borderBottom: `1px solid ${theme.checkbox.border}`,
  },
  iconContainerStyles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyles: {
    visibility: 'hidden',
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    top: 0,
    left: 0,
  },
  labelStyles: {
    cursor: 'pointer',
  },
});
