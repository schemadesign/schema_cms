const ITEM_HEIGHT = 30;
const PADDING = 7;

export const containerStyles = {
  display: 'flex',
  maxWidth: '300px',
  border: '1px solid #D2D2D2',
};

export const getSelectStyle = (hidden = false) => ({
  display: hidden ? 'none' : 'flex',
});

export const selectWrapperStyles = {
  display: 'flex',
  position: 'relative',
  padding: `${PADDING}px`,
  width: '100%',
  cursor: 'pointer',
};

export const customOptionStyle = index => ({
  display: 'flex',
  cursor: 'pointer',
  padding: `${PADDING}px`,
  borderTop: index ? '1px solid #D2D2D2' : 'none',
});

export const selectedOptionsStyles = {
  display: 'flex',
  height: `${ITEM_HEIGHT}px`,
  cursor: 'pointer',
  width: '100%',
};

export const selectedOptionStyles = {
  display: 'flex',
  cursor: 'pointer',
  height: `${ITEM_HEIGHT}px`,
  alignItems: 'center',
};

export const optionListStyles = menuOpen => ({
  display: menuOpen ? 'flex' : 'none',
  maxHeight: '175px',
  overflow: menuOpen ? 'auto' : 'hidden',
  flexDirection: 'column',
  position: 'absolute',
  width: '100%',
  top: `${ITEM_HEIGHT + PADDING * 2 + 2}px`,
  left: '0',
  backgroundColor: '#FFFFFF',
});
