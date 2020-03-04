export const getStyles = ({ open }) => ({
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    position: 'relative',
    paddingRight: 40,
  },
  iconContainerStyles: {
    cursor: 'pointer',
    transition: 'transform 200ms ease-in-out',
    transformOrigin: 'center center',
    fontSize: 0,
    transform: `rotate(${open ? 180 : 0}deg) translateY(-50%)`,
    position: 'absolute',
    right: 0,
    top: '50%',
  },
});
