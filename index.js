const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Blasting calculation route
app.post('/calculate', (req, res) => {
  const { z, n, options } = req.body;
  let select = 0;
  let sel = -1;

  // Calculation logic
  for (let i = 0; i < n; i++) {
    const d = options[i].diameter;
    const c = options[i].cost;
    const nh = options[i].numberOfHoles;

    const h = d * 0.107;
    const b = 0.4 * h;
    const l = 2.6 * b;
    const s = 1.4 * b;
    const x = 19 / Math.pow(z, 2.5);
    const q = Math.pow((2 * Math.pow((b * s * h), 0.8)) / (100 * x), 1.2);
    const t = q * c * nh;

    if (select < (1 / t)) {
      select = 1 / t;
      sel = i;
    }
  }

  // If selection is valid, return the calculated data
  if (sel !== -1) {
    const d = options[sel].diameter;
    const c = options[sel].cost;
    const nh = options[sel].numberOfHoles;
    const h = d * 0.107;
    const b = 0.4 * h;
    const l = 2.6 * b;
    const s = 1.4 * b;
    const x = 19 / Math.pow(z, 2.5);
    const q = Math.pow((2 * Math.pow((b * s * h), 0.8)) / (100 * x), 1.2);
    const t = q * c * nh;

    res.json({
      selectedOption: sel + 1,
      d, h, nh, c, b, l, s, x, q, t,
    });
  } else {
    res.status(400).json({ error: 'No valid selection made' });
  }
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
