import React, {Component} from 'react';
import PropTypes from 'prop-types';


class InputWithSubmit extends Component {

  static propTypes = {
    hiddenValue: PropTypes.any,
    submit: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      value: '',
    }
  }

  onChange = e => this.setState({value: e.target.value})

  onSubmit = (e) => {
    e.preventDefault();
    const {submit} = this.props;
    const {value} = this.state;
    if (this.props.hiddenValue) {
      submit(value, this.props.hiddenValue);
    } else {
      submit(value);
    }

  }

  render = () => {
    const {value} = this.state;
    return <div>
      <input onChange={this.onChange} value={value} />
      <button onClick={this.onSubmit}>Submit</button>
    </div>;
  }
}

export default InputWithSubmit;
