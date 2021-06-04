const {ipcRenderer} = require('electron');
const path = require('path');
const {PythonShell} = require('python-shell');

const menu = new Vue({
  el: '#menu-container',
  methods: {
    displayCalc: displayCalc,
    displayPing: displayPing
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
    pingMain: pingMain
  }
});

async function displayCalc() {
  content.title = 'Python Calculator';
  content.contentType = 'pyCalc';

  if (!Object.keys(content.contentData).length) {
    content.contentData = {
      leftNumber: '',
      rightNumber: '',
      operator: '',
      result: ''
    };
  };
}

async function displayPing() {
  content.title = 'Pinger';
  content.contentType = 'pinger';
  await pingMain();
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