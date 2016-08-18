import {
  DEFAULT_ACTION,
  defaultActionFunction,
  default as MainMapReducer
} from './MainMap'

describe('(Redux Module) MainMap', () => {
  it('Should export a constant DEFAULT_ACTION.', () => {
    expect(DEFAULT_ACTION).to.equal('DEFAULT_ACTION')
  })
})