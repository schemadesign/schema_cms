import React from 'react';
import { shallow } from 'enzyme';

import { ImageScrapingScript } from '../imageScrapingScript.component';
import { defaultProps } from '../imageScrapingScript.stories';

describe('DataWranglingScript: Component', () => {
  const component = props => <ImageScrapingScript {...defaultProps} {...props} />;

  const render = (props = {}) => shallow(component(props));

  it('should render correctly with loader', () => {
    const wrapper = render();
    global.expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    defaultProps.fetchDataSource = jest.fn().mockReturnValue(Promise.resolve());
    const wrapper = render(defaultProps);
    await Promise.resolve();
    global.expect(wrapper).toMatchSnapshot();
  });
});
