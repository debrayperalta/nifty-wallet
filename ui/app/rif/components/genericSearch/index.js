import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * This search bar has 3 ways of working <br>
 * Simple filter => Filter in an array by a string <br>
 * Object filter => Filter in an array of objects a property of X object <br>
 * Custom filter => Use a function that receives the typed value, may be asynchronous <br>
 * In the first 2 cases, the resultSetFunction must be called to receive the filtered data <br>
 * In the last case, the resultSetFunction is optional <br>
 */
class GenericSearch extends Component {

  static propTypes = {
    filterFunction: PropTypes.func,
    resultSetFunction: PropTypes.func,
    filterProperty: PropTypes.string,
    data: PropTypes.array,
    criteria: PropTypes.any,
    placeholder: PropTypes.string,
  }

  handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const {value} = e.target;
      const {resultSetFunction, criteria, filterProperty, data} = this.props;
      // Simple filter in elements of array (no objects)
      if (criteria && !filterProperty) {
        const result = data.filter(element => String(element).includes(String(criteria)));
        return resultSetFunction(result);
      }
      // Filter of 1st level, with the property to check
      if (criteria && filterProperty) {
        const result = data.filter(element => String(element[filterProperty]).includes(String(criteria)));
        return resultSetFunction(result);
      }
      // In other cases, we just perform the function passed down
      // We have a second function to set the values, or any other side effect
      const {filterFunction} = this.props
      const result = await filterFunction(value);
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
