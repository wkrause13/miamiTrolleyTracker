import React, { View } from 'react-native';
import { shallow } from 'enzyme';

import Preferences from './Preferences';

describe('<Preferences />', () => {
  it('should be a view component', () => {
    const wrapper = shallow(<Preferences />);
    expect(wrapper.type()).to.equal(View);
  });
});