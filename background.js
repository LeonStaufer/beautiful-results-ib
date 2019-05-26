console.log("BEAUTIFUL IB RESULTS: %s", "loading");

//defining browser to support chrome
window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

//when the toolbar button is clicked call messageTab
browser.browserAction.onClicked.addListener(()=>{
    let querying = browser.tabs.query({
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