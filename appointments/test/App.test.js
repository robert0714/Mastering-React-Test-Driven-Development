import React from 'react';
import { createShallowRenderer, type } from './shallowHelpers';
import 'whatwg-fetch';
import { createContainer } from './domManipulators';
import { fetchResponseOk } from './spyHelpers';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { App } from '../src/App';

describe('App', () => {
  let render, elementMatching, child;
  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
  });
  afterEach(() => {
    // window.fetch.mockRestore();
  });
  it('initially shows the AppointmentsDayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });
  it('has a button bar as the first child', () => {
    render(<App />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });
});
