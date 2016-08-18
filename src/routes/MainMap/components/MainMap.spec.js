import React, { View } from 'react-native';
import { shallow } from 'enzyme';

import MainMap from './MainMap';

describe('<MainMap />', () => {
  it('should be a view component', () => {
    const wrapper = shallow(<MainMap />);
    expect(wrapper.type()).to.equal(View);
  });
});