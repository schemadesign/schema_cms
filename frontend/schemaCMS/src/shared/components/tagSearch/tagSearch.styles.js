import styled from 'styled-components';

export const Container = styled.div`
  padding-bottom: 30px;
`;

export const Title = styled.div`
  font-size: 15px;
  padding: 10px 0 5px;
`;

export const TagsContainer = styled.div`
  margin-top: 10px;
  padding: 0 20px 20px;
  border: 1px solid ${({ theme }) => theme.border};
`;

export const NoTags = styled.div`
  margin-top: 15px;
  text-align: center;
  color: ${({ theme }) => theme.secondaryText};
`;

export const getCustomSelectStyles = theme => ({
  menu: styles => ({
    ...styles,
    border: `1px solid ${theme.select.border}`,
    padding: 0,
    borderRadius: 0,
    zIndex: 1000,
    background: theme.select.background,
    minHeight: 62,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  }),
  menuList: styles => ({
    ...styles,
    padding: 0,
    width: '100%',
  }),
  valueContainer: styles => ({ ...styles, background: 'transparent', border: 'none' }),
  indicatorSeparator: styles => ({ ...styles, display: 'none' }),
  clearIndicator: styles => ({
    ...styles,
    color: theme.secondaryText,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'transparent',
      color: theme.text,
    },
  }),
  multiValue: styles => ({ ...styles, background: 'none', border: `1px solid ${theme.text}` }),
  multiValueLabel: styles => ({ ...styles, color: theme.text }),
  input: styles => ({ ...styles, color: theme.text }),
  multiValueRemove: styles => ({
    ...styles,
    color: theme.secondaryText,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'transparent',
      color: theme.text,
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    height: 62,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    background: isFocused ? theme.text : theme.select.background,
    color: isFocused ? theme.background : theme.secondaryText,
    borderBottom: `1px solid ${theme.select.border}`,
    width: '100%',
    ':active': { background: theme.text },
  }),
  control: styles => ({
    ...styles,
    background: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
    border: `2px solid ${theme.border}`,
    ':hover': { border: `2px solid ${theme.secondaryText}` },
  }),
});
