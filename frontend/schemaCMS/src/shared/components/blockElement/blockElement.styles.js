import styled from 'styled-components';

const ICON_CONTAINER_WIDTH = 50;

export const DetailsContainer = styled.div`
  padding-left: ${ICON_CONTAINER_WIDTH}px;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.div``;

export const IconContainer = styled.div`
  width: ${ICON_CONTAINER_WIDTH}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const getCustomInputStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '10px 0 10px 20px',
});
