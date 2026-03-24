// Approximation of erf() : DO NOT TOUCH - COPIED STRAIGHT FROM CHATGPT - MESSING THIS UP BREAKS ENTIRE CODE
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

// Normal CDF Function: This is the function which shows how you place (percentile) compared to everyone else using mean and std.
function normalCDF(x, mean, std) {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
}
let currentMean3 = null;
let currentStd3 = null;
let currentMean4 = null;
let currentStd4 = null;
let currentMeanX = null;
let currentStdX = null;
const subjects = {
  stoopid: { MeanX: null, Mean4: null, Mean3: null, sdX: null, sd4: null, sd3: null, MaxMarksX: null, MaxMarks4: null, MaxMarks3: null},
  english: { MeanX: 32.6, Mean4: 66.2, Mean3: 65.7, sdX: 8, sd4: 14.9, sd3: 14.8, MaxMarksX: 60, MaxMarks4: 100, MaxMarks3: 100},
};

//This updates the values for each subject as they are changed from the dropdown so that the calculator uses the values for that specific subject.
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
// Rounds numbers to given number of decimal places 
function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}
// Button function: Basically everything else - all of this happens when u press the button only.
//z => the SAC average for unit 3,
//y=> the SAC average for unit 4
//x=> predicted exam mark
function calculate() {
  const z = parseFloat(document.getElementById("z").value);
  const y = parseFloat(document.getElementById("y").value);
  const x = parseFloat(document.getElementById("x").value);
  const selected = document.getElementById("subject").value;
  const data = subjects[selected];

// This here is for if someone forgets to select a subject
  if (currentMean3 === null || currentStd3 === null || currentMean4 === null || currentStd4 === null || currentMeanX === null || currentStdX === null) {
    document.getElementById("result").innerText =
      "are we deadass";
    return;
  }
// p3, p4, pX is the percentiles for each unit/exam
  let p3 = normalCDF(z, currentMean3, currentStd3);
  let p4 = normalCDF(y, currentMean4, currentStd4);
  let pX = normalCDF(2*x, currentMeanX, currentStdX);
 
  p3 = Math.max(0, Math.min(1, p3));
  p4 = Math.max(0, Math.min(1, p4));
  pX = Math.max(0, Math.min(1, pX));
  
//Makes sure that no one gets 100th percentile - not technically possible as your score cannot be higher than yourself
  if ((z) >= data.MaxMarks3) {
  p3 = .9999;
  }
  if ((y) >= data.MaxMarks4) {
  p4 = .9999;
  }
  if ((2 * x) >= data.MaxMarksX) {
  pX = .9999;
  }

  let examScaled = 2 * x; // exam is marked twice but people wont consider this when they put in their exam score
  let combined =
    (z * 0.25) +
    (y * 0.25) +
    (examScaled * 0.5);

  //Estimate combined mean and SD
  let combinedMean =
    (data.Mean3 * 0.25) +
    (data.Mean4 * 0.25) +
    ((data.MeanX * 2) * 0.5);

  let combinedSD = Math.sqrt(
    Math.pow(data.sd3 * 0.25, 2) +
    Math.pow(data.sd4 * 0.25, 2) +
    Math.pow((data.sdX * 2) * 0.5, 2)
  );

  //Percentile
  let percentile = normalCDF(combined, combinedMean, combinedSD);

  // percentile is between 0.00 and 99.99  
  percentile = Math.max(0, Math.min(1, percentile));
  percentile = Math.min(percentile, 0.9999);

  //Study score calculation
  let StudyScore = percentile * 50;

  // Output
  document.getElementById("result").innerText =
    "Study Score = " + roundTo(StudyScore, 2);
}

