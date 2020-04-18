import React, { Component } from 'react';
import { loadBugs, resolveBug, getUnresolvedBugs } from '../store/bugs';
import { connect } from 'react-redux';

class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs();
  }

  handleResolve = (bugId) => () => {
    this.props.resolveBug(bugId);
  };

  render() {
    return (
      <ul>
        {this.props.bugs.map((bug) => (
          <li key={bug.id}>
            {bug.description} <button onClick={this.handleResolve(bug.id)}>Resolve Bug</button>
          </li>
        ))}
      </ul>
    );
  }
}

// bugs: state.entities.bugs.list
const mapStateToProps = (state) => ({
  //   bugs: state.entities.bugs.list,
  bugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: (bugId) => dispatch(resolveBug(bugId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bugs);
