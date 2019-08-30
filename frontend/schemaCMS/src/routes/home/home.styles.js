import styled from 'styled-components';
import { Theme } from 'schemaUI';
import { ReactComponent as LogoSVG } from '../../images/icons/logo.svg';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: ${Theme.primary.typography.p.fontFamily};
  margin: 10px;

  > a {
    font-weight: 200;
    font-size: 16px;
    display: block;
    width: 100%;
    text-align: left;
    padding: 2px 0;
    margin: 4px 0;
  }
`;

export const Logo = styled(LogoSVG)`
  width: 100px;
  margin-bottom: 20px;
`;
