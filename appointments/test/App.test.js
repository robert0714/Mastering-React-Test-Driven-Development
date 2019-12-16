import React from 'react';
import {
  childrenOf,
  createShallowRenderer,
  type
} from './shallowHelpers';
import 'whatwg-fetch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { App } from '../src/App';

describe('App', () => {
  let render, elementMatching;
  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
  });
  afterEach(() => {
    // window.fetch.mockRestore();
  });
  it('initially shows the AppointmentsDayViewLoader', () => {
      render(<App />);
      expect(elementMatching(type(AppointmentsDayViewLoader))).toBeDefined();
  });
});
