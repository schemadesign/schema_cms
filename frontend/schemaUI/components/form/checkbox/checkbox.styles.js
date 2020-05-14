import { defaultTheme } from '../../../utils/theme';

export const getStyles = ({ theme = defaultTheme, reverse }) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: reverse ? 'row-reverse' : 'row',
    justifyContent: reverse ? 'flex-end' : 'space-between',
    alignItems: 'center',
    height: 48,
    color: theme.checkbox.text,
    borderBottom: reverse ? 'none' : `1px solid ${theme.checkbox.border}`,
  },
  iconContainerStyles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 0,
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
    marginRight: reverse ? 10 : 0,
  },
  elementStyles: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
