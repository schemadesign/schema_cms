import React from 'react';
import { act } from 'react-test-renderer';

import { PageList, Page } from '../pageList.component';
import { defaultProps } from '../pageList.stories';
import { makeContextRenderer } from '../../../../shared/utils/testUtils';
import { section } from '../../../../modules/sections/sections.mocks';
import { Container as DotsMenuContainer } from '../../../../shared/components/dotsMenu/dotsMenu.styles';
import { DotsMenu } from '../../../../shared/components/dotsMenu';

const mockPushHistory = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockPushHistory,
  }),
  useParams: () => ({
    sectionId: 'sectionId',
  }),
}));

describe('PageList: Component', () => {
  const render = props => makeContextRenderer(<PageList {...defaultProps} {...props} />);

  it('should render correctly', async () => {
    const wrapper = await render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly', async () => {
    jest.spyOn(defaultProps, 'fetchSection');
    await render();

    expect(defaultProps.fetchSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
  });

  it('should copy page', async () => {
    jest.spyOn(defaultProps, 'copyPage');
    const wrapper = await render();
    await act(async () => {
      await wrapper.root
        //Page card
        .findByProps({ id: 'page-2-item' })
        //ThreeDotsMenu
        .findByType(DotsMenuContainer)
        .props.onClick();
      await wrapper.root
        //Page card
        .findByProps({ id: 'page-2-item' })
        //Copy option from Dots Menu
        .findByProps({ id: 'select-item-2' })
        .props.onClick();
    });

    expect(defaultProps.copyPage).toHaveBeenCalledWith({ pageId: 2, sectionId: 'sectionId' });
  });

  it('should set main page', async () => {
    const props = {
      ...section.pages[0],
      setFieldValue: Function.prototype,
      copyPage: Function.prototype,
      removePage: Function.prototype,
      sectionId: 'sectionId',
      mainPage: null,
      index: 1,
    };

    jest.spyOn(props, 'setFieldValue');
    const wrapper = await makeContextRenderer(<Page {...props} />);

    await act(async () => {
      await wrapper.root
        //ThreeDotsMenu
        .findByType(DotsMenuContainer)
        .props.onClick();
      await wrapper.root
        //Set Home Page option from Dots Menu
        .findByProps({ id: 'select-item-0' })
        .props.onClick();
    });

    expect(props.setFieldValue).toHaveBeenCalledWith('mainPage', 1);
  });

  it('should unset main page', async () => {
    const props = {
      ...section.pages[0],
      setFieldValue: Function.prototype,
      copyPage: Function.prototype,
      removePage: Function.prototype,
      sectionId: 'sectionId',
      mainPage: 1,
      index: 1,
    };

    jest.spyOn(props, 'setFieldValue');
    const wrapper = await makeContextRenderer(<Page {...props} />);
    await act(async () => {
      await wrapper.root
        //ThreeDotsMenu
        .findByType(DotsMenuContainer)
        .props.onClick();
      await wrapper.root
        //Set Home Page option from Dots Menu
        .findByProps({ id: 'select-item-0' })
        .props.onClick();
    });

    expect(props.setFieldValue).toHaveBeenCalledWith('mainPage', null);
  });

  it('should remove page and redirect to content', async () => {
    jest.spyOn(defaultProps, 'removeSection');
    const wrapper = await render();

    act(() => {
      wrapper.root.findByProps({ id: 'removeSection' }).props.onClick();
    });
    act(() => {
      wrapper.root.findByProps({ id: 'confirmRemovalBtn' }).props.onClick();
    });

    await Promise.resolve();
    expect(defaultProps.removeSection).toHaveBeenCalledWith({ sectionId: 'sectionId' });
    expect(mockPushHistory).toHaveBeenCalledWith('/project/1/content');
  });
});
