(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */



    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
    document.body.style.border = "5px solid red";

    function c1(){
        console.log("im pressed")
        document.body.style.border = "15px solid blue";
    }

    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "dash_1") {
            c1();
        }
    });
})();