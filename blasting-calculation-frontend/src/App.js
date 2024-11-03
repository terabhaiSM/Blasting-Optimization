import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [z, setZ] = useState(2.5); // Powder factor
  const [options, setOptions] = useState([
    { diameter: "", cost: "", numberOfHoles: "" },
  ]);
  const [result, setResult] = useState(null); // Result from backend
  const [modalData, setModalData] = useState(null); // Data for the modal
  const [showModal, setShowModal] = useState(false); // Modal visibility

  const descriptions = {
    d: {
      title: "Diameter of Hole (d)",
      explanation:
        "The diameter of the drilled hole directly impacts the type and amount of explosive that can be placed within it. A larger diameter allows for a greater volume of explosives, which generally results in more significant energy release and greater fragmentation.",
      context:
        "Different rock formations and desired fragmentation sizes often dictate the choice of hole diameter. A precise diameter ensures efficient energy utilization without excessive or insufficient explosive loads.",
    },
    h: {
      title: "Bench Height (h)",
      explanation:
        "Bench height represents the vertical distance between different levels of rock or soil that is being drilled and blasted. This height affects the burden, spacing, and overall design of the blast.",
      context:
        "Optimal bench height ensures the blast covers the intended volume of material while minimizing environmental impact. Taller benches may require more explosives, while shorter benches need less, balancing safety, effectiveness, and cost.",
    },
    nh: {
      title: "Number of Holes (nh)",
      explanation:
        "The number of holes drilled represents how many individual explosive charges will be set up within a specific area.",
      context:
        "Increasing the number of holes can improve fragmentation and allow for more control over the blasting area. However, more holes mean higher drilling and explosive costs. Strategic placement of fewer holes with effective spacing and burden can achieve similar results with lower costs.",
    },
    c: {
      title: "Cost per Kilogram of Explosive (c)",
      explanation:
        "This parameter provides the cost per kilogram of the explosive material used. Different explosives vary in price based on composition, strength, and other properties.",
      context:
        "Knowing the cost per kilogram helps in planning the total blasting cost. Choosing an appropriate explosive based on rock hardness and desired fragmentation size ensures efficient cost management while achieving the necessary rock breakage.",
    },
    b: {
      title: "Burden (b)",
      explanation:
        "Burden is the horizontal distance from the free face of the rock to the nearest hole. It indicates the thickness of the rock layer that the blast will attempt to break.",
      context:
        "Correct burden calculation is crucial as it ensures that the blast energy is efficiently used. Too large a burden may cause insufficient breakage, while too small a burden risks fly rock and poor fragmentation.",
    },
    l: {
      title: "Length of Hole (l)",
      explanation:
        "This is the depth or length of each drilled hole, which must be sufficient to place the right amount of explosives based on the height of the bench and desired blast depth.",
      context:
        "The hole length influences the fragmentation and distribution of blast energy. Accurate hole lengths prevent incomplete fragmentation and ensure that explosives reach the intended depth, maximizing energy release.",
    },
    s: {
      title: "Spacing (s)",
      explanation:
        "Spacing refers to the distance between consecutive holes in a row and directly affects how evenly the blast energy spreads across the area.",
      context:
        "Proper spacing is crucial to avoid overlap of blast energy or gaps in fragmentation. Balanced spacing maintains consistent fragmentation and reduces energy wastage, leading to more efficient blasting patterns.",
    },
    x: {
      title: "Fragmentation Size (x)",
      explanation:
        "Fragmentation size is the anticipated size of rock pieces after blasting. It’s a key output parameter that reflects the effectiveness of the blast in breaking down rock to a manageable size.",
      context:
        "The target fragmentation size varies based on the application. Smaller fragmentation is ideal for handling and transport but may require more explosive energy. Controlling fragmentation size can also minimize wear on subsequent processing equipment.",
    },
    q: {
      title: "Charge per Hole (q)",
      explanation:
        "This is the amount of explosive used in each hole. The charge per hole impacts the energy release per blast cycle.",
      context:
        "By adjusting the charge per hole, miners can control the intensity of the blast. Smaller charges are used for precise work in sensitive areas, while larger charges are used for massive rock displacements.",
    },
    t: {
      title: "Total Cost of Blasting (t)",
      explanation:
        "This represents the overall cost of explosives and drilling per blast, calculated based on the number of holes, diameter, and other parameters.",
      context:
        "The total cost calculation enables mining operations to optimize budgets, plan efficient resource allocation, and assess cost-effectiveness per ton of material extracted. Lowering this cost while maintaining desired fragmentation quality is a common objective.",
    },
  };

  // Open modal with description for the given parameter
  const handleOpenModal = (param) => {
    setModalData(descriptions[param]);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Add a new option
  const addOption = () => {
    setOptions([...options, { diameter: "", cost: "", numberOfHoles: "" }]);
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
      alert("Please fill all fields");
      return;
    }

    axios
      .post("http://localhost:5001/calculate", {
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
                  handleOptionChange(index, "diameter", e.target.value)
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
                  handleOptionChange(index, "cost", e.target.value)
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
                  handleOptionChange(index, "numberOfHoles", e.target.value)
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
        <button type="submit" className="button submit-button">
          Calculate
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Calculation Results</h2>
          <div className="result-item">
            <span className="result-label">Selected Option:</span>
            <span className="result-value">{result.selectedOption}</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("d")}>
            <span className="result-label">Diameter of hole (d):</span>
            <span className="result-value">{result.d} mm</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("h")}>
            <span className="result-label">Height of bench (h):</span>
            <span className="result-value">{result.h.toFixed(3)} m</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("nh")}>
            <span className="result-label">Number of holes (nh):</span>
            <span className="result-value">{result.nh}</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("c")}>
            <span className="result-label">Cost of explosive (c):</span>
            <span className="result-value">₹{result.c}</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("b")}>
            <span className="result-label">Burden (b):</span>
            <span className="result-value">{result.b.toFixed(3)} m</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("l")}>
            <span className="result-label">Length of hole (l):</span>
            <span className="result-value">{result.l.toFixed(3)} m</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("s")}>
            <span className="result-label">Spacing (s):</span>
            <span className="result-value">{result.s.toFixed(3)} m</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("x")}>
            <span className="result-label">Fragmentation size (x):</span>
            <span className="result-value">{result.x.toFixed(3)} mm</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("q")}>
            <span className="result-label">Charge per hole (q):</span>
            <span className="result-value">{result.q.toExponential(3)} kg</span>
          </div>
          <div className="result-item" onClick={() => handleOpenModal("t")}>
            <span className="result-label">Total cost of blasting (t):</span>
            <span className="result-value">₹{result.t.toFixed(6)}</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalData?.title}</h3>
            <p>
              <strong>Explanation:</strong> {modalData?.explanation}
            </p>
            <p>
              <strong>Context:</strong> {modalData?.context}
            </p>
            <button className="button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
