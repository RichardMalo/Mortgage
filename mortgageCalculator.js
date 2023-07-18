// Populate interest rate dropdown
const interestRateSelect = document.getElementById("interestRate");
for (let i = 2; i <= 10; i += 0.5) {
  const option = document.createElement("option");
  option.value = i / 100;
  option.textContent = `${i}%`;
  interestRateSelect.appendChild(option);
}

function calculateMortgage() {
  const principal = parseFloat(document.getElementById("principal").value);
  const amortization = parseInt(document.getElementById("amortization").value);
  const term = parseInt(document.getElementById("term").value);
  const interestRate = parseFloat(document.getElementById("interestRate").value);

  const monthlyRate = interestRate / 12;
  const numPayments = amortization * 12;
  const termPayments = term * 12;

  const mortgagePayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const data = [];

  let remainingBalance = principal;

  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = mortgagePayment - interestPayment;
    remainingBalance -= principalPayment;

    if (i <= termPayments) {
      data.push({ x: i, y: [principalPayment, interestPayment] });
    }
  }

// Plot the data using Plotly
const trace1 = {
  x: data.map((d) => d.x),
  y: data.map((d) => d.y[0]),
  name: 'Principal',
  type: 'bar',
  text: data.map((d) => d.y[0].toFixed(2)),
  textposition: 'auto'
};

const trace2 = {
  x: data.map((d) => d.x),
  y: data.map((d) => d.y[1]),
  name: 'Interest',
  type: 'bar',
  text: data.map((d) => d.y[1].toFixed(2)),
  textposition: 'auto'
};

const layout = {
  barmode: 'stack',
  title: 'Mortgage Payment Breakdown',
  xaxis: {
    title: 'Payment Number',
  },
  yaxis: {
    title: 'Payment Amount',
  },
};

const config = { responsive: true };

Plotly.newPlot('chart', [trace1, trace2], layout, config);
}