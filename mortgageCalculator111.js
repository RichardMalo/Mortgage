// Populate interest rate dropdown
const interestRateSelect = document.getElementById("interestRate");
for (let i = 2; i <= 10; i += 0.5) {
  const option = document.createElement("option");
  option.value = i / 100;
  option.textContent = `${i}%`;
  interestRateSelect.appendChild(option);
}

function calculateMortgage(event) {
  event.preventDefault();

  const principal = parseFloat(document.getElementById("principal").value);
  const amortization = parseInt(document.getElementById("amortization").value);
  const term = parseInt(document.getElementById("term").value);
  const interestRate = parseFloat(document.getElementById("interestRate").value.replace(/[^0-9.]/g, '')) / 100;

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

  // Calculate the total monthly payment for display in legend
  const totalMonthlyPayment = data[0].y[0] + data[0].y[1];

  // Plot the data using Plotly
  const trace1 = {
    x: data.map((d) => d.x),
    y: data.map((d) => d.y[0]),
    name: 'Principal',
    type: 'bar',
    text: data.map((d) => d.y[0].toFixed(2)),
    textposition: 'auto',
    marker: { color: '#0E6663' } // Add the color for Principal bars
  };

  const trace2 = {
    x: data.map((d) => d.x),
    y: data.map((d) => d.y[1]),
    name: 'Interest',
    type: 'bar',
    text: data.map((d) => d.y[1].toFixed(2)),
    textposition: 'auto',
    marker: { color: '#C64359' } // Add the color for Interest bars
  };

  const layout = {
    barmode: 'stack',
    title: 'Mortgage Payment Breakdown',
    xaxis: {
      title: 'Payment Number',
      tickmode: 'linear',
      dtick: 12
    },
    yaxis: {
      title: 'Payment Amount',
    },
    width: 1800, // Set the width of the chart
    height: 380, // Set the height of the chart
  };

  const config = { responsive: true };

  Plotly.newPlot('chart', [trace1, trace2], layout, config);

  // Call the new function to plot the second chart
  plotCumulativeChart(data);
}

function plotCumulativeChart(data) {
    const cumulativePayments = [];
    const remainingBalances = [];
    let totalPayment = 0;
    let remainingBalance = parseFloat(document.getElementById("principal").value);
  
    data.forEach((d, i) => {
      totalPayment += d.y[0] + d.y[1];
      remainingBalance -= d.y[0];
  
      cumulativePayments.push({ x: i + 1, y: totalPayment });
      remainingBalances.push({ x: i + 1, y: remainingBalance });
    });
  
    const trace1 = {
      x: cumulativePayments.map((d) => d.x),
      y: cumulativePayments.map((d) => d.y.toFixed(2)),
      name: 'Cumulative Payments',
      type: 'bar',
      marker: { color: '#0E6663' } // Add the color for Cumulative Payments bars
    };
  
    const trace2 = {
      x: remainingBalances.map((d) => d.x),
      y: remainingBalances.map((d) => d.y.toFixed(2)),
      name: 'Remaining Balance',
      type: 'bar',
      marker: { color: '#C64359' } // Add the color for Remaining Balance bars
    };
  
    const layout = {
      barmode: 'group',
      title: 'Cumulative Payments vs Remaining Balance',
      xaxis: {
        title: 'Payment Number',
        tickmode: 'linear',
        dtick: 12
      },
      yaxis: {
        title: 'Amounts',
      },
      width: 1900, // Set the width of the chart
      height: 380, // Set the height of the chart
    };
  
    const config = { responsive: true };
  
    Plotly.newPlot('chart2', [trace1, trace2], layout, config);
  }

  // Get the form element and attach the event listener
  const form = document.getElementById("mortgageForm");
  form.addEventListener("submit", calculateMortgage); 