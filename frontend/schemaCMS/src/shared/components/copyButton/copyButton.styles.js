import styled from 'styled-components';

export const Container = styled.div`
  cursor: pointer;
  position: relative;
`;

export const getCopyIconStyles = ({ error, theme }) => ({
  fill: error ? theme.error : theme.icon.fill,
});
