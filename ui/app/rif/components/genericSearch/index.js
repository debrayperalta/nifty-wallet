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
    const {placeholder} = this.props;
    return (
      <div className="search-bar-container">
        <input
          placeholder={placeholder || ''}
          className={'search-bar'}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    )
  }
}

export default GenericSearch;
