export const containerStyles = {
  position: 'relative',
};

export const iconContainerStyles = {
  position: 'absolute',
  right: 0,
  top: 0,
};

export const inputStyles = {
  visibility: 'hidden',
  position: 'absolute',
  overflow: 'hidden',
  height: 0,
  top: 0,
  left: 0,
};

export const getButtonStyles = disabled => ({
  fontSize: 0,
  opacity: disabled ? 0.5 : 1,
  display: 'flex',
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 5,
});

export const getValueStyles = disabled => ({
  fontSize: 18,
  lineHeight: '24px',
  width: 'calc(100% - 70px)',
  paddingBottom: 30,
  display: 'block',
  cursor: disabled ? 'cursor' : 'pointer',
  opacity: disabled ? 0.5 : 1,
});

export const getLabelStyles = label => ({
  top: label ? 10 : 0,
  position: 'relative',
});
