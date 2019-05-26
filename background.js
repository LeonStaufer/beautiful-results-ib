console.log("BEAUTIFUL IB RESULTS: %", "loading");

//when the toolbar button is clicked call messageTab
browser.browserAction.onClicked.addListener(()=>{
    var querying = browser.tabs.query({
        active: true,
        currentWindow: true
    });
    querying.then(messageTab);
});

//send message to the current tab
function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        action: "display"
    });
}