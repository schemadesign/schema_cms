import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import { create, act } from 'react-test-renderer';
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { addSerializer } from 'jest-specific-snapshot';

addSerializer(styleSheetSerializer);

const asyncSnapshot = async ({ story, context, done }) => {
  const converter = new Stories2SnapsConverter({
    snapshotsDirName: './__tests__/__snapshots__',
  });
  const snapshotFilename = converter.getSnapshotFileName(context);
  const storyElement = story.render();

  let wrapper = null;
  await act(async () => {
    wrapper = create(storyElement);
  });

  if (snapshotFilename) {
    expect(wrapper.toJSON()).toMatchSpecificSnapshot(snapshotFilename);
  }

  done();
};

initStoryshots({
  configPath: './src/.storybook',
  framework: 'react',
  asyncJest: true,
  test: asyncSnapshot,
});


