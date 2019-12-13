export const containerStyles = {};

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

export const customInputStyles = {
  width: 'calc(100% - 70px)',
  textOverflow: 'ellipsis',
};

export const getLabelStyles = label => ({
  top: label ? 10 : 0,
  position: 'relative',
});

export const iconContainerStyles = {
  position: 'absolute',
  right: 0,
  top: 0,
};
