const {ipcRenderer} = require('electron');
const path = require('path');
const {PythonShell} = require('python-shell');

const menu = new Vue({
  el: '#menu-container',
  methods: {
    displayCalc: displayCalc,
    displayPing: displayPing,
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
    pingMain: pingMain,
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

async function displayPing() {
  content.title = 'Pinger';
  content.contentType = 'pinger';
  await pingMain();
}

async function displayStocker() {
  content.title = 'Stocks';
  content.contentType = 'stocks';

  content.contentData = {
    ticker: '',
    result: ''
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

async function pingMain() {
  try {
    ipcRenderer.send('synchronous-message', 'ping');
    ipcRenderer.once('synchronous-reply', (event, replyContent) => {
      content.contentData = replyContent;
    });
  } catch (err) {
    console.log(err);
  }
}

async function pyGetStockInfo() {
  try {
    const pyshell = new PythonShell(path.join(__dirname, '/scripts/stock.py'));
    pyshell.send(JSON.stringify(content.contentData.ticker));

    pyshell.on('message', async function(result) {
      content.contentData.result = result;
    });

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

// alpha vantage api key (does not give real-time prices): BAN6ZI5K8G2CDG95
// polygon.io api key: 6MPlJOcupCIEfR5laS_PDzyBuGKNupbL