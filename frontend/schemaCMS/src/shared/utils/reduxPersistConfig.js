import storage from 'redux-persist/lib/storage';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import immutablePersistenceTransform from '../services/immutablePersistenceTransform';

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST_CONFIG = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'schemaCMS',
    storage,
    // Reducer keys that you do NOT want stored to persistence here.
    blacklist: [],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ['userAuth', 'userProfile'],
    stateReconciler: autoMergeLevel1,
    transforms: [immutablePersistenceTransform],
  },
};

export default REDUX_PERSIST_CONFIG;
