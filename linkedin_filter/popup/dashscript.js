function listenForClicks() {
    //console.log("im alive")
    //document.body.style.border = "5px solid red";

    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }

        function reset(tabs) {

            browser.tabs.sendMessage(tabs[0].id, {
                command: "dash_1",
            });
        }

        function reportError(e){

        }

        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(reset)
            .catch(reportError);
    })



}

function reportExecuteScriptError(error) {
    //document.querySelector("#popup-content").classList.add("hidden");
    //document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

browser.tabs.executeScript({ file: "https://github.com/candenizcam/firefox_extensions/blob/master/linkedin_filter/run_test.js" })
/*
browser.tabs
    .executeScript({ file: "/content_scripts/dash_insert.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError)
*/

