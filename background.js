importScripts('save-to-anki.js');

async function saveNote(message, sender, sendResponse) {
  console.debug(`message: ${JSON.stringify(message)}`);
  if (message.action === "addNote") {
    // First request permission. This pops up a permission dialog in the Anki
    // GUI to request permission for this page's origin to send requests to
    // AnkiConnect. Request must be sent with mode 'no-cors', which means that
    // we can't examine the result of this request to ensure that permission
    // was granted. We'll have to wait until the following fetch to see.
    await fetch('http://localhost:8765', {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        "action": "requestPermission",
        "version": 6,
      })
    });
    const requestBody = {
      action: "guiAddCards",
      version: 6,
      params: {
        note: message.note,
      },
    };

    console.debug(`requestBody: ${JSON.stringify(requestBody)}`);
    try {
      const response = await fetch('http://localhost:8765', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const msgResp = {status: response.status, body: response.text()};
      console.debug(`msgResp: ${JSON.stringify(msgResp)}`);
      sendResponse && sendResponse(msgResp);
      return msgResp;
    } catch (e) {
      const errResp = {status: 599, error: `${e}`};
      sendResponse && sendResponse(errResp);
      return errResp;
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    await saveNote(message, sender, sendResponse);
  })();
  return true;
});

chrome.commands.onCommand.addListener((command, tab) => {
  console.log(`command: ${command}`);
  if (command === "save-note") {
    (async () => {
      saveToAnki(tab, /* inServiceWorker = */ true);
    })();
  }
  return true;
});
