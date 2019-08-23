import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'seamless-immutable';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable';

import createReducer from './reducers';
import rootSaga from './sagas';

const transformerConfig = {
  whitelistPerReducer: {
    userAuth: ['isAuthenticated', 'jwtToken '],
  },
  blackListPerReducer: {
    userProfile: ['user', 'isFetched'],
  },
};

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'schemaCMS',
  storage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator(transformerConfig)],
};

export default function configureStore(initialState = {}) {
  const middlewares = [sagaMiddleware];

  const enhancers = [];

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  } else if (process.env.NODE_ENV === 'development') {
    const { persistState } = require('redux-devtools');

    const getDebugSessionKey = () => {
      const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
      return matches && matches.length > 0 ? matches[1] : null;
    };

    Array.prototype.push.apply(enhancers, [
      require('../shared/utils/devtools.component').default.instrument(),
      persistState(getDebugSessionKey(), state => Immutable(state)),
    ]);
  }

  const persistedReducer = persistCombineReducers(persistConfig, createReducer());

  const store = createStore(
    persistedReducer,
    Immutable(initialState),
    compose(
      applyMiddleware(...middlewares),
      ...enhancers
    )
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const createReducers = require('./reducers').default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  }

  return { store, persistor };
}
