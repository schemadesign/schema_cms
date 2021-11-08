import styled from 'styled-components';
import { TextInput } from '../form/inputs/textInput';

export const Container = styled.div`
  padding-bottom: 50px;
`;

export const TabsContainer = styled.div`
  width: 100%;
`;

export const SelectContainer = styled.div`
  position: relative;
  z-index: 999;
`;

export const StyledTextInput = styled(TextInput)`
  ::placeholder {
    color: #4f515c;
  }
  ::-webkit-input-placeholder {
    color: #4f515c;
  }
`;
