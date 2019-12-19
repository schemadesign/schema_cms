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

export const buttonStyles = {
  fontSize: 0,
};

export const valueStyles = {
  fontSize: 18,
  lineHeight: '24px',
  width: 'calc(100% - 70px)',
  paddingBottom: 30,
  display: 'block',
  cursor: 'pointer',
};

export const getLabelStyles = label => ({
  top: label ? 10 : 0,
  position: 'relative',
});
