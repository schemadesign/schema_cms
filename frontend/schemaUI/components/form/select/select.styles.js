const ITEM_HEIGHT = '30';

export const containerStyles = {
  display: 'flex',
};

export const getSelectStyle = (hidden = false) => ({
  display: hidden ? 'none' : 'flex',
});

export const selectWrapperStyles = {
  display: 'flex',
  position: 'relative',
};

export const customOptionStyle = {
  display: 'flex',
  cursor: 'pointer',
};

export const selectedOptionsStyles = {
  display: 'flex',
  height: `${ITEM_HEIGHT}px`,
};

export const selectedOptionStyles = {
  display: 'flex',
  cursor: 'pointer',
  height: `${ITEM_HEIGHT}px`,
};

export const optionListStyles = menuOpen => ({
  display: menuOpen ? 'flex' : 'none',
  maxHeight: '75px',
  overflow: menuOpen ? 'auto' : 'hidden',
  flexDirection: 'column',
  position: 'absolute',
  top: `${ITEM_HEIGHT}px`,
  left: '0',
  backgroundColor: '#FFFFFF',
});
