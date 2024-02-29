document.body.style.border = "50px solid green";


(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    document.body.style.border = "50px solid green";

})();