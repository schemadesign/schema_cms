import styled from 'styled-components';
import { media } from '../../../theme/media';

const ICON_SIZE = 30;

export const Container = styled.div``;

export const Form = styled.form``;

export const TitleWrapper = styled.div`
  margin: 10px 0 20px;
  text-align: center;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  max-width: calc(100% - ${2 * ICON_SIZE}px);

  ${media.desktop`
    max-width: calc(100% - ${50 + 3 * ICON_SIZE}px);
  `};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const getCustomInputStyles = theme => ({
  backgroundColor: theme.secondaryText,
  padding: '10px 30px 10px 20px',
});

export const InputContainer = styled.div`
  position: relative;
  padding-bottom: 30px;
`;

export const inputContainerStyles = {
  paddingBottom: '2px',
};

export const editIconStyles = {
  position: 'absolute',
  right: 5,
  top: 5,
};
