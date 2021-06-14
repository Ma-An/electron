const path = require('path');
const {PythonShell} = require('python-shell');

const menu = new Vue({
  el: '#menu-container',
  methods: {
    displayCalc: displayCalc,
    displayStocker: displayStocker
  }
});

const content = new Vue({
  el: '#content-container',
  data: {
    title: '',
    contentType: '',
    contentData: false
  },
  methods: {
    pyCalculate: pyCalculate,
    pyGetStockInfo: pyGetStockInfo
  }
});

async function displayCalc() {
  content.title = 'Python Calculator';
  content.contentType = 'pyCalc';

  content.contentData = {
    leftNumber: '',
    rightNumber: '',
    operator: '',
    result: ''
  };
}

async function displayStocker() {
  content.title = 'Stocks';
  content.contentType = 'stocks';

  content.contentData = {
    ticker: '',
    currentPrice: '',
    dailyChange: ''
  };
}

async function pyCalculate() {
  try {
    const pyshell = new PythonShell(path.join(__dirname, '/scripts/calc.py'));
    // JSON.stringify(content.contentData)
    pyshell.send(JSON.stringify([content.contentData]));

    pyshell.on('message', function(result) {
      content.contentData.result = result;
    });

    // end the input stream and allow the process to exit
    pyshell.end(function(err, code, signal) {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
    });
  } catch (err) {
    console.log(err);
  }
}

async function pyGetStockInfo() {
  try {
    const pyshell = new PythonShell(path.join(__dirname, '/scripts/stock.py'));
    if (content.contentData.ticker) {
      pyshell.send(JSON.stringify(content.contentData.ticker));

      pyshell.on('message', async function(result) {
        const stockInfo = JSON.parse(result);
        content.contentData.currentPrice = stockInfo.currentPrice;
        content.contentData.dailyChange = stockInfo.dailyChange;
        console.log(result);
      });

      pyshell.end(function(err, code, signal) {
        if (err) throw err;
        console.log('The exit code was: ' + code);
        console.log('The exit signal was: ' + signal);
        console.log('finished');
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// alpha vantage api key (does not give real-time prices): BAN6ZI5K8G2CDG95
// polygon.io api key: 6MPlJOcupCIEfR5laS_PDzyBuGKNupbL