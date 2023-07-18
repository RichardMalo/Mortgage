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
  
    // Calculate the remaining mortgage amount and amount paid off at the end of the term
    const remainingMortgage = remainingBalance.toFixed(2);
    const amountPaidOff = (principal - remainingBalance).toFixed(2);
  
    // Create the trace for the third chart
const trace3 = {
  values: [remainingMortgage, amountPaidOff],
  labels: ['Remaining Mortgage', 'Amount Paid Off'],
  type: 'pie',
  marker: {
  colors: ['#C64359', '#0E6663']
  },
  textinfo: 'label+percent',
  textposition: 'inside',
  automargin: true
  };
  
  // Set the layout for the third chart
  const layout3 = {
  title: 'Remaining Mortgage vs Amount Paid Off',
  width: 700, // Set the width of the chart
  height: 500, // Set the height of the chart
  margin: {
  l: 50,
  r: 50,
  b: 50,
  t: 100,
  pad: 4
  }
  };
  
  // Create the chart
  Plotly.newPlot('chart3', [trace3], layout3);
  }
  
  // Get the form element and attach the event listener
  const form = document.getElementById("mortgageForm");
  form.addEventListener("submit", calculateMortgage);