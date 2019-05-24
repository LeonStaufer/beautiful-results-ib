console.log("Loaded");

browser.browserAction.onClicked.addListener(()=>{
    console.log("clicked");
    let execution = browser.tabs.executeScript({
        file: "contentScript.js"
    });
    execution.then(onExecuted);
});

function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        replacement: "beautify"
    });
}

function onExecuted(result) {
    var querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
}
