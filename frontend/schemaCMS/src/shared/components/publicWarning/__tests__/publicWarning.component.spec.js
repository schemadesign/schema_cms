import React from 'react';

import { PublicWarning } from '../publicWarning.component';
import { defaultProps } from '../publicWarning.stories';
import { makeContextRenderer } from '../../../utils/testUtils';
import { FILE_TYPE, IMAGE_TYPE } from '../../../../modules/blockTemplates/blockTemplates.constants';

describe('PublicWarning: Component', () => {
  const render = props => makeContextRenderer(<PublicWarning {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with type file', async () => {
    const wrapper = await render({ type: FILE_TYPE });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with time image', async () => {
    const wrapper = await render({ type: IMAGE_TYPE });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with multiple types', async () => {
    const wrapper = await render({ type: [IMAGE_TYPE, FILE_TYPE] });
    expect(wrapper).toMatchSnapshot();
  });
});
