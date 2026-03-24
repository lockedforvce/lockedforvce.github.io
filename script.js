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
  const q = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1)
              * t * Math.exp(-x * x);

  return sign * q;
}

// Normal CDF
function normalCDF(x, mean, std) {
  return 0.5 * (1 + erf((2*x - mean) / (std * Math.sqrt(2))));
}
let currentMean = null;
let currentStd = null;
const subjects = {
  stoopid: { meanX: null, Mean4: null, Mean3: null, sdX: null, sd4: null, sd3: null, MaxMarksX: null, MaxMarks4: null, MaxMarks3: null},
  english: { meanX: 32.6, Mean4: 66.2, Mean3: 65.7, sdX: 8, sd4: 14.9, sd3: 14.8, MaxMarksX: 60, MaxMarks4: 100, MaxMarks3: 100},
};
function updateValues() {
  const selected = document.getElementById("subject").value;

  if (!selected) return;

  const data = subjects[selected];

  currentMean3 = data.Mean3;
  currentStd3 = data.sd3;
  currentMean4 = data.Mean4;
  currentStd4 = data.sd4;
  currentMeanX = data.MeanX;
  currentStdX = data.sdX;
}
function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
// Button function
function calculate() {
  const x = parseFloat(document.getElementById("x").value);
  const selected = document.getElementById("subject").value;
  const data = subjects[selected];
  
  if (currentMean3 === null || currentStd3 === null || currentMean4 === null || currentStd4 === null || currentMeanX === null || currentStdX === null) {
    document.getElementById("result").innerText =
      "are we deadass";
    return;
  }

  let p3 = normalCDF(z, currentMean3, currentStd3);
  let p4 = normalCDF(y, currentMean4, currentStd4);
  let pX = normalCDF(x, currentMeanX, currentStdX);
 
  p3 = Math.max(0, Math.min(1, p3));
  p4 = Math.max(0, Math.min(1, p4));
  pX = Math.max(0, Math.min(1, pX));

  if ((z) >= data.MaxMarks3) {
  p3 = .9999;
  if ((y) >= data.MaxMarks4) {
  p4 = .9999;
  if ((2 * x) >= data.MaxMarksX) {
  pX = .9999;

}
  let StudyScore = (p3 * .25) + (p4 * .25) + (pX * .5)
   
    document.getElementById("ss").innerText =
    "Study Score = " + roundTo(StudyScore,2);
}

