const {ipcRenderer} = require('electron');

const menu = new Vue({
  el: '#menu-container',
  methods: {
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
    pingMain: pingMain
  }
});

async function displayPing() {
  content.title = 'Pinger';
  content.contentType = 'pinger';
  await pingMain();
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