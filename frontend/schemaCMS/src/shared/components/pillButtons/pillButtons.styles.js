import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 35px 0 24px;
`;

const buttonStyles = {
  width: '100%',
};

export const leftButtonStyles = {
  ...buttonStyles,
  marginRight: 10,
};

export const rightButtonStyles = {
  ...buttonStyles,
};
