import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { Theme } from 'schemaUI';

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

export const StepCounter = styled.div`
  width: 34%;
  text-align: center;
`;

export const Empty = styled.div`
  width: 33%;
`;

export const UploadContainer = styled.div`
  width: 33%;
  text-align: right;
`;

export const Error = styled.div`
  color: ${Theme.light.error};
`;

export const Link = styled(RouterLink)`
  color: ${Theme.light.text};
  text-decoration: none;
`;
