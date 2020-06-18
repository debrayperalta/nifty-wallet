import React, {Component} from 'react';
import PropTypes from 'prop-types';

class GenericSearch extends Component {

  static propTypes = {
    filterFunction: PropTypes.func.isRequired,
    resultSetFunction: PropTypes.func,
    placeholder: PropTypes.string,
  }


  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const {value} = e.target;
      const {filterFunction, resultSetFunction} = this.props;
      const result = filterFunction(value);
      if (resultSetFunction) resultSetFunction(result);
    }
  }

  render () {
    return (
      <div className="search-bar-container">
        <input
          placeholder="Search for domains"
          className={'search-bar'}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    )
  }
}

export default GenericSearch;
