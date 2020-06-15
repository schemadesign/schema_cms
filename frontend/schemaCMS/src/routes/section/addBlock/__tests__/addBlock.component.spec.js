import React from 'react';

import { AddBlock } from '../addBlock.component';
import { defaultProps } from '../addBlock.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    sectionId: 'sectionId',
  }),
}));

describe('AddBlock: Component', () => {
  const render = props => makeContextRenderer(<AddBlock {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch section', async () => {
    jest.spyOn(defaultProps, 'fetchSection');
    await render({ section: {} });

    expect(defaultProps.fetchSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
  });
});
