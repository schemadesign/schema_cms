import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useLinkPreview } from '../useLinkPreview.hook';
import { ProvidersWrapper as MockProviders } from '../../utils/testUtils';

describe('useLinkPreview: Hook', () => {
  it('should return metaTags', () => {
    const { result } = renderHook(() => useLinkPreview(), {
      // eslint-disable-next-line react/prop-types
      wrapper: ({ children }) => <MockProviders context={{}}>{children}</MockProviders>,
    });
    const [metaTags] = result.current;
    expect(metaTags).toBe(null);
  });

  it('should return fetchLink function', () => {
    const { result } = renderHook(() => useLinkPreview(), {
      // eslint-disable-next-line react/prop-types
      wrapper: ({ children }) => <MockProviders context={{}}>{children}</MockProviders>,
    });
    const [, fetchLink] = result.current;
    expect(fetchLink).toBeInstanceOf(Function);
  });
});
