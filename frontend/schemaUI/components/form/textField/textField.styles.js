import { light } from '../../../utils/theme';

export const getStyles = (theme = light) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '30px',
    position: 'relative',
  },
  defaultLabelStyles: {
    color: theme.textField.label,
    fontSize: '18px',
    lineHeight: '24px',
  },
  errorStyles: {
    color: theme.textField.error,
  },
  iconContainerStyles: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
