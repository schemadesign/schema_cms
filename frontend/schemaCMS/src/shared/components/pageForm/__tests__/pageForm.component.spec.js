import React from 'react';

import { PageForm } from '../pageForm.component';
import { defaultProps } from '../pageForm.stories';
import { makeContextRenderer } from '../../../utils/testUtils';

describe('PageForm: Component', () => {
  const render = props => makeContextRenderer(<PageForm {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call setRemoveModalOpen', async () => {
    jest.spyOn(defaultProps, 'setRemoveModalOpen');
    const wrapper = await render();
    wrapper.root.findByProps({ id: 'removePage' }).props.onClick();

    expect(defaultProps.setRemoveModalOpen).toHaveBeenCalledWith(true);
  });
});
