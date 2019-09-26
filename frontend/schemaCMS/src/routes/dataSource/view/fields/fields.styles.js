import styled from 'styled-components';
import { identity } from 'ramda';
import { styleWhenTrue } from '../../../../shared/utils/rendering';

export const Container = styled.div``;

export const Navigation = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
`;

export const NavigationButton = styled.div`
  flex: 0 0 auto;
  width: 60px;
`;

export const NavigationLabel = styled.div`
  margin: 0 10px;
  flex: 1 1 auto;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const Content = styled.div``;

export const buttonStyles = {
  width: 60,
  height: 60,
};

export const arrowStyles = styleWhenTrue(identity, { opacity: 0.3 }, {});
