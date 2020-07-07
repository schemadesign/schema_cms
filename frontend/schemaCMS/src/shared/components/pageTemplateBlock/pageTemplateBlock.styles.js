import styled, { css } from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.text};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const InputContainer = styled.div`
  padding-left: 0;
  width: calc(100% - 81px);
`;

export const customSelectStyles = css`
  padding-bottom: 0;
`;

export const customLabelStyles = {
  borderTop: 'none',
};
