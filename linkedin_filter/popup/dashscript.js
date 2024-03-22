function listenForClicks() {
    //console.log("im alive")
    //document.body.style.border = "5px solid red";

    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }

        function action(tabs) {
            let command;
            if(e.target.id==="mark"){
                command = "c1";
                document.body.style.border = "5px solid green";
            }else if(e.target.id==="remove"){
                command = "c2";
                document.body.style.border = "5px solid blue";
            }else if(e.target.id==="remove-refresh"){
                command = "c3";
                document.body.style.border = "5px solid red";
            }else if(e.target.id==="record"){
                command = "c4";
                document.body.style.border = "5px solid purple";
            }


            browser.tabs.sendMessage(tabs[0].id, {
                command: command,
            });
        }

        function reportError(e){

        }



        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(action)
            .catch(reportError);
    })



}

function reportExecuteScriptError(error) {
    //document.querySelector("#popup-content").classList.add("hidden");
    //document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}


browser.tabs
    .executeScript({ file: "/content_scripts/dash_insert.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError)








