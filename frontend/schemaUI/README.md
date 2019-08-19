# Schema UI Components

Schema UI Components is a set of React components created to support Schema CMS.

To install, simply run `yarn`.

## Development

We use Storybooks for developing components. Run `yarn storybook` to get started.

## Linking with Schema CMS

Until we have it released to NPM, we are going to use `npm link`. If not already linked to the global packages
simply run `npm link` command and wait for indexing.
In `Schema CMS project` run `npm link schemaUI` to make the module available.

Obs. In order to make the components available you have to run `yarn build`.
Otherwise Schema CMS will throw an error that webpack couldn't resolve `schemaUI` path.


## Creating Components with Plop

To create a new component run `plop`, choose a name for your project and follow the options presented.

## Testing

We set up a jest testing environment with snapshots. Simply running `yarn test` will run tests.

