import styled from 'styled-components';
import { Form as FormikForm } from 'formik';

import { media } from '../../../theme/media';

export const Row = styled.div`
  display: grid;
  grid-template-columns: 100%;

  ${media.tablet`
    grid-template-columns: auto auto;
    grid-gap: 20px;
  `};
`;

export const Form = styled(FormikForm)`
  padding-top: 24px;
`;
