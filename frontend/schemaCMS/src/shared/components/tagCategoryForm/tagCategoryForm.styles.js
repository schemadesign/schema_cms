import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

export const TagContainer = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0;
`;

export const Tag = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 2px solid ${({ theme }) => theme.border};
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;

export const Error = styled.div`
  color: ${({ theme: { textField } }) => textField.error};
  font-size: 14px;
  font-weight: normal;
`;

export const AddNewTagContainer = styled.div`
  text-align: center;
  padding: 20px 0 40px;
  cursor: pointer;
  color: ${({ theme }) => theme.secondaryText};
`;

export const Switches = styled.div`
  border-top: 2px solid ${({ theme }) => theme.border};
  padding: 10px 0 20px;
`;

export const CheckboxLabel = styled.label`
  margin-right: 20px;
`;

export const removeIconStyles = {
  width: 35,
  height: 35,
  minWidth: 35,
  marginLeft: 5,
  cursor: 'pointer',
};

export const customCheckboxGroupStyles = {
  border: 'none',
  flexDirection: 'row',
};
