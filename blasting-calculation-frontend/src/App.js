import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [z, setZ] = useState(2.5); // Powder factor
  const [options, setOptions] = useState([
    { diameter: '', cost: '', numberOfHoles: '' },
  ]); // List of options
  const [result, setResult] = useState(null); // Result from backend

  // Add a new option
  const addOption = () => {
    setOptions([...options, { diameter: '', cost: '', numberOfHoles: '' }]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validOptions = options.filter(
      (opt) => opt.diameter && opt.cost && opt.numberOfHoles
    );

    if (validOptions.length === 0) {
      alert('Please fill all fields');
      return;
    }

    axios
      .post('http://localhost:5001/calculate', {
        z,
        n: validOptions.length,
        options: validOptions,
      })
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Handle input change for options
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  return (
    <div className="App">
      <h1>Blasting Calculation</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <label>Powder Factor (z): </label>
          <input
            type="number"
            value={z}
            onChange={(e) => setZ(e.target.value)}
            step="0.1"
            required
          />
        </div>

        <h2>Explosive Options</h2>
        {options.map((option, index) => (
          <div key={index} className="option">
            <div className="input-group">
              <label>Diameter of Hole (d) (mm):</label>
              <input
                type="number"
                value={option.diameter}
                onChange={(e) =>
                  handleOptionChange(index, 'diameter', e.target.value)
                }
                required
              />
            </div>
            <div className="input-group">
              <label>Cost (c) (Rs/Kg):</label>
              <input
                type="number"
                value={option.cost}
                onChange={(e) =>
                  handleOptionChange(index, 'cost', e.target.value)
                }
                required
              />
            </div>
            <div className="input-group">
              <label>Number of Holes (nh):</label>
              <input
                type="number"
                value={option.numberOfHoles}
                onChange={(e) =>
                  handleOptionChange(index, 'numberOfHoles', e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}

        <button type="button" className="button" onClick={addOption}>
          Add Option
        </button>
        <button type="submit" className="button submit-button">Calculate</button>
      </form>

      {result && (
        <div className="result">
          <h2>Selected Option: {result.selectedOption}</h2>
          <p>Diameter of hole (d): {result.d}</p>
          <p>Height of bench (h): {result.h}</p>
          <p>Number of holes (nh): {result.nh}</p>
          <p>Cost of explosive (c): {result.c}</p>
          <p>Burden (b): {result.b}</p>
          <p>Length of hole (l): {result.l}</p>
          <p>Spacing (s): {result.s}</p>
          <p>Fragmentation size (x): {result.x}</p>
          <p>Charge per hole (q): {result.q}</p>
          <p>Total cost of blasting (t): {result.t}</p>
        </div>
      )}
    </div>
  );
}

export default App;
