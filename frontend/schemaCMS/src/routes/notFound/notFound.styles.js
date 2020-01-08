import styled from 'styled-components';
import SchemaLogoSVG from '../../images/icons/schemaLogo.svg';

export const Logo = styled(SchemaLogoSVG)`
  fill: ${({ theme: { text } }) => text};
  width: 96px;
  height: 16px;
`;
