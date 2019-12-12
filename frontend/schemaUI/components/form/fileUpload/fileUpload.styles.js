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
  display: 'flex',
  width: 60,
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

export const listContainerStyles = {
  position: 'relative',
};

export const itemContainerStyles = {
  fontSize: '18px',
  lineHeight: '24px',
};

export const itemStyles = {
  display: 'flex',
  alignItems: 'center',
};

export const removeIconStyles = {
  width: 30,
  height: 30,
  marginLeft: 20,
  cursor: 'pointer',
};
