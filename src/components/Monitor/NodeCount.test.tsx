import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { NodeCountInner } from './NodeCount';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let counts = {
    count: 2255,
    PRE_ENABLED: 0,
    ENABLED: 2116,
    EXPIRED: 0,
    UPDATE_REQUIRED: 0,
    WATCHDOG_EXPIRED: 45,
    NEW_START_REQUIRED: 92,
    POSE_BAN: 2,
    __typename: 'NodeCountPayload'
  };
  ReactDOM.render(<NodeCountInner data={counts} />, div);
});