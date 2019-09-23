import { light } from '../../utils/theme';

export const getStyles = (theme = light) => ({
  containerStyles: {
    color: theme.header.text,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '18px 0',
    alignItems: 'flex-start',
    width: '100%',
  },
  buttonStyles: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 6,
    right: 0,
  },
});
