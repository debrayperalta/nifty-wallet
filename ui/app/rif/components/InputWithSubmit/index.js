import React, {Component} from 'react';
import PropTypes from 'prop-types';


class InputWithSubmit extends Component {

  static propTypes = {
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
    submit(value);
  }

  render = () => {
    const {value} = this.state;
    return <div>
      <input onChange={this.onSubmit} value={value} />
      <button onSubmit={this.onSubmit}>Submit</button>
    </div>;
}
}

export default InputWithSubmit;
