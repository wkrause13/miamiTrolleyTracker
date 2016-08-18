import { connect } from 'react-redux'
import { defaultActionFunction } from '../modules/<%= pascalEntityName %>'

import <%= pascalEntityName %> from '../components/<%= pascalEntityName %>'

const mapActionCreators = {
  defaultActionFunction: () => defaultActionFunction(1),
}

const mapStateToProps = (state) => ({
  counter: state.counter
})

export default connect(mapStateToProps, mapActionCreators)(<%= pascalEntityName %>)
