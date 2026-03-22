// Approximation of erf()
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1)
              * t * Math.exp(-x * x);

  return sign * y;
}

// Normal CDF
function normalCDF(x, mean, std) {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}
const subjects = {
  english: { mean: 32.6, sd: 8 },
  chemistry: { mean: 125.3, sd: 47.2 },
  biology: { mean: 146.2, sd: 44 }
};
// Button function
function calculate() {
  const x = parseFloat(document.getElementById("x").value);

  const result = normalCDF(x, mean, std);

  document.getElementById("result").innerText =
    "P(X ≤ x) = " + result.toFixed(5);
}
