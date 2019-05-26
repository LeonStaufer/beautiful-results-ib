console.log("BEAUTIFUL IB RESULTS: %s", "loading");

//defining browser to support chrome
window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

//send message to the current tab
function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        action: "display"
    });
}

//when the toolbar button is clicked call messageTab
browser.browserAction.onClicked.addListener(()=>{
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, messageTab);
});