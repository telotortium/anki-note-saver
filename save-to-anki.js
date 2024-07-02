async function saveToAnki(tabInit, inServiceWorker) {
  let tab;
  console.debug("tabInit: %o", tabInit);
  // The Tab object is a JSON object, so check for the keys we need.
  if (tabInit && "url" in tabInit) {
    tab = tabInit;
  } else {
      console.debug("before chrome.tabs.query");
      [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  }
  if (tab.title === null || tab.title === undefined || tab.title === '') {
    tab.title = prompt('Please enter a title for this page:');
  }
  const note = {
    deckName: "Articles",
    modelName: "Pocket Article",
    fields: {
      given_url: tab.url,
      given_title: tab.title,
    },
    tags: ["anki-save-note", "anki:year-delay"],
  };

  console.debug("before chrome.runtime.sendMessage");
  const message = { action: "addNote", note };
  let response;
  if (inServiceWorker) {
    response = await saveNote(message);
  } else {
    response = await chrome.runtime.sendMessage({ action: "addNote", note });
  }
  console.debug("sendMessage response: %o", response);
  if (response && response.status == 200) {
    console.log("Note saved successfully! url: %s, title: %s", tab.url, tab.title);
  } else {
    console.error("Request failed: status: %o, body: %o", response.status, response.body);
  }
}

function noteFromTab(tab) {
}
