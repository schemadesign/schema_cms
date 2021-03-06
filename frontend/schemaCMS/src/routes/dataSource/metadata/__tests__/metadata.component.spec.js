import React from 'react';

import { Metadata } from '../metadata.component';
import { defaultProps } from '../metadata.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';

describe('Metadata: Component', () => {
  const render = props => makeContextRenderer(<Metadata {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch metadata', async () => {
    jest.spyOn(defaultProps, 'fetchMetadata');
    await render();
    expect(defaultProps.fetchMetadata).toHaveBeenCalledWith({ dataSourceId: 1 });
  });
});
