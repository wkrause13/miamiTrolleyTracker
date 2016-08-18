import React, { View } from 'react-native';
import { shallow } from 'enzyme';

import <%= pascalEntityName %> from './<%= pascalEntityName %>';

describe('<<%= pascalEntityName %> />', () => {
  it('should be a view component', () => {
    const wrapper = shallow(<<%= pascalEntityName %> />);
    expect(wrapper.type()).to.equal(View);
  });
});