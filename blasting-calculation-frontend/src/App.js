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

  // Remove an option by index
  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
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
          <label>Powder Factor (z) :</label>
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
            <button
              type="button"
              className="button remove-button"
              onClick={() => removeOption(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="button" onClick={addOption}>
          Add Option
        </button>
        <button type="submit" className="button submit-button">Calculate</button>
      </form>
{result && (
  <div className="result">
    <h2>Calculation Results</h2>
    <div className="result-item">
      <span className="result-label">Selected Option:</span>
      <span className="result-value">{result.selectedOption}</span>
    </div>
    <div className="result-item">
      <span className="result-label">Diameter of hole (d):</span>
      <span className="result-value">{result.d} mm</span>
    </div>
    <div className="result-item">
      <span className="result-label">Height of bench (h):</span>
      <span className="result-value">{result.h.toFixed(3)} m</span>
    </div>
    <div className="result-item">
      <span className="result-label">Number of holes (nh):</span>
      <span className="result-value">{result.nh}</span>
    </div>
    <div className="result-item">
      <span className="result-label">Cost of explosive (c):</span>
      <span className="result-value">₹{result.c}</span>
    </div>
    <div className="result-item">
      <span className="result-label">Burden (b):</span>
      <span className="result-value">{result.b.toFixed(3)} m</span>
    </div>
    <div className="result-item">
      <span className="result-label">Length of hole (l):</span>
      <span className="result-value">{result.l.toFixed(3)} m</span>
    </div>
    <div className="result-item">
      <span className="result-label">Spacing (s):</span>
      <span className="result-value">{result.s.toFixed(3)} m</span>
    </div>
    <div className="result-item">
      <span className="result-label">Fragmentation size (x):</span>
      <span className="result-value">{result.x.toFixed(3)} mm</span>
    </div>
    <div className="result-item">
      <span className="result-label">Charge per hole (q):</span>
      <span className="result-value">{result.q.toExponential(3)} kg</span>
    </div>
    <div className="result-item">
      <span className="result-label">Total cost of blasting (t):</span>
      <span className="result-value">₹{result.t.toFixed(6)}</span>
    </div>
  </div>
)}
    </div>
  );
}

export default App;
