import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100% - 50px);
`;

export const IconsContainer = styled.div``;

export const InputContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-left: 30px;
`;

export const customLabelStyles = {
  borderTop: 'none',
};
