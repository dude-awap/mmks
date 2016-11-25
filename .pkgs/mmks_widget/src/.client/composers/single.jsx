import {useDeps} from 'react-simple-di';
import {composeAll} from 'react-komposer';
import composeWithTracker from '../../../../lib/compose-with-tracker.js';

import authComposer from '/client/access_control/acComposer';

export const singleComposer = ({context, _id, accesspoints, clearErrors}, onData) => {
  // console.log( ' composer/single.jsx', accesspoints );

  const {Meteor, Collections, LocalState} = context();
  const error = LocalState.get('_widgets.DELETE_ERROR');
  if (Meteor.subscribe('_widgets.single', _id).ready()) {
    const record = Collections.Widgets.findOne(_id);
    if (record) {
      onData(null, {record, error});
    }
  }
  //    returns clearErrors when unmounting the component
  //    Caution : actions always unmount the component,
  //           so clearErrors will wipe action errors before than can be seen
  // return clearErrors;

};

export const depsMapper = (context, actions) => ({
  hideAction: actions._widgets.hide,
  deleteAction: actions._widgets.delete,
  clearErrors: actions._widgets.clearErrors,
  context: () => context
});

export default (component) => composeAll(
    composeWithTracker(authComposer),
    composeWithTracker(singleComposer),
    useDeps(depsMapper)
  )(component);
