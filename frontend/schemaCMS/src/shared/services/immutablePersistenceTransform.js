import { identity, has, when } from 'ramda';
import Immutable from 'seamless-immutable';

// is this object already Immutable?
const isImmutable = has('asMutable');

// change this Immutable object into a JS object
const convertToJs = state => state.asMutable({ deep: true });

// optionally convert this object into a JS object if it is Immutable
const fromImmutable = when(isImmutable, convertToJs);

// convert this JS object into an Immutable object
const toImmutable = raw => Immutable(raw);

// the transform interface that redux-persist is expecting
export default {
  out: state => {
    state.mergeDeep = identity;
    console.log(state, 'about to return immutable');
    return toImmutable(state);
  },
  in: raw => {
    return fromImmutable(raw);
  },
};
