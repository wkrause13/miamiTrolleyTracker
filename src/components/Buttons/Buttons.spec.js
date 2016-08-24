import React, { View } from 'react-native';
import { shallow } from 'enzyme';

import Fab from './Fab';

describe('<Fab />', () => {
  it('should be a view component', () => {
    const wrapper = shallow(<Fab />);
    expect(wrapper.type()).to.equal(View);
  });
});