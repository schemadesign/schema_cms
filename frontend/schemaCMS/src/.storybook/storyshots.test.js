import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import renderer from 'react-test-renderer';

const asyncSnapshot = ({ story, context, done }) => {
  const converter = new Stories2SnapsConverter({
    snapshotsDirName: './__tests__/__snapshots__',
  });
  const snapshotFilename = converter.getSnapshotFileName(context);
  const storyElement = story.render();
  const tree = renderer.create(storyElement).toJSON();

  if (snapshotFilename) {
    expect(tree).toMatchSpecificSnapshot(snapshotFilename);
  }

  done();
};

initStoryshots({
  configPath: './src/.storybook',
  framework: 'react',
  asyncJest: true,
  test: asyncSnapshot,
});
