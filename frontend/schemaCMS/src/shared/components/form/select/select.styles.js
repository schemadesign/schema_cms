import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  position: relative;
  font-size: 18px;
  cursor: pointer;

  label {
    margin-bottom: 2px;
  }

  ${({ customStyles }) => customStyles};
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 0;
  top: 5px;
`;
