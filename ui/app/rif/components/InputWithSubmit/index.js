import React, {useState} from 'react';

const InputWithSubmit = (submit) => {
  const [value, setValue] = useState('');

  const onChange = e => setValue(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    submit(value);
  }

  return <div>
      <input onChange={onChange} value={value} />
      <button onSubmit={onSubmit}>Submit</button>
  </div>
}

export default InputWithSubmit;
