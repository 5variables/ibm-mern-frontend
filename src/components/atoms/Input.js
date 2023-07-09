import { useState } from "react";
import './atoms-style.css';

const Input = ({ _onInputChange, _placeholder }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputText(value);
    _onInputChange(value);
  }

  return <input autoComplete="false" autoCorrect="false" type="text" value={inputText} onChange={handleInputChange} placeholder={_placeholder}/>;
};

export default Input;
