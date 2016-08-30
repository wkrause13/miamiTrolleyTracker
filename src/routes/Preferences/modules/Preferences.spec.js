import {
  DEFAULT_ACTION,
  defaultActionFunction,
  default as PreferencesReducer
} from './Preferences'

describe('(Redux Module) Preferences', () => {
  it('Should export a constant DEFAULT_ACTION.', () => {
    expect(DEFAULT_ACTION).to.equal('DEFAULT_ACTION')
  })
})