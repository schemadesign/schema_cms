export const containerStyles = {
  position: 'relative',
};

export const innerContainerStyles = {
  height: '240px',
  color: '#6E6E7B',
  backgroundColor: '#1B1C23',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export const newLabelStyles = {
  borderTop: `none`,
};

export const customBinStyles = {
  marginLeft: 20,
  minWidth: 20,
};

export const inputStyles = {
  visibility: 'hidden',
  position: 'absolute',
  overflow: 'hidden',
  height: 0,
  top: 0,
  left: 0,
};

export const getContainerStyles = usesNewStyling => ({
  fontSize: 18,
  lineHeight: '24px',
  width: 'calc(100% - 70px)',
  paddingBottom: 30,
  display: 'flex',
  alignItems: 'center',
  wordBreak: 'break-word',
  cursor: usesNewStyling ? 'cursor' : 'pointer',
  opacity: usesNewStyling ? 0.5 : 1,
});

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

export const getValueStyles = (disabled, usesNewStyling, hasContent) => ({
  fontSize: 18,
  lineHeight: '24px',
  width: usesNewStyling ? (hasContent ? 'auto' : '185px') : 'calc(100% - 70px)',
  paddingBottom: 30,
  display: 'flex',
  alignItems: 'center',
  textAlign: usesNewStyling && !hasContent ? 'center' : 'left',
  wordBreak: 'break-word',
  cursor: disabled ? 'cursor' : 'pointer',
  opacity: disabled ? 0.5 : 1,
});

export const getIconWrapperStyles = usesNewStyling => ({
  position: usesNewStyling ? 'relative' : 'absolute',
  right: 0,
  top: 0,
});

export const getLabelStyles = label => ({
  top: label ? 10 : 0,
  position: 'relative',
});
