import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../../theme/styled';

export const Container = styled.div``;

export const Form = styled.form``;

export const Link = styled(RouterLink)`
  padding: 5px;
  color: ${colors.black};
  margin: 10px 0;
  text-decoration: none;
`;

export const buttonStyles = {
  padding: '0 30px',
  marginRight: '20px',
};

export const LinksWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
`;
