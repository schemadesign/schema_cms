import styled from 'styled-components';

const ICON_SIZE = 30;
export const INPUT_HEIGHT = 77;

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100% - ${50 + 4 * ICON_SIZE}px);
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  height: ${INPUT_HEIGHT}px;
`;

export const InputContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-left: 30px;
`;

export const customLabelStyles = {
  borderTop: 'none',
};

export const iconStyles = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  cursor: 'pointer',
};

export const elementIcon = {
  ...iconStyles,
  marginLeft: 5,
  marginRight: 25,
  cursor: 'default',
};
