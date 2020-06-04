import styled, { css } from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.text};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const InputContainer = styled.div`
  padding-left: 0;
  width: 100%;
`;

export const customSelectStyles = css`
  padding-bottom: 0;
`;

export const customLabelStyles = {
  borderTop: 'none',
};
