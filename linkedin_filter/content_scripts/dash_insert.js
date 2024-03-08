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

    const killCompanies = ["Turing", "Crossover"];

    function cardHandler(thisElement){
        let cn =thisElement.getElementsByClassName("job-card-container__primary-description")[0].textContent;
        console.log(cn);
        let b = false;
        killCompanies.forEach(e=>{
            if (cn.includes(e)){
                b= true;
            }
        })
        return b;
    }

    function c1(){
        let c = document. getElementsByClassName("scaffold-layout__list-container")[0].children;
        let scroller = document.getElementsByClassName("jobs-search-results-list")[0];
        let jumpDist = scroller.scrollHeight/c.length;
        console.log(jumpDist);
        var a = 0;
        for (let thisElement of c){
            scroller.scrollBy({
                top: jumpDist,
                left: 0,
                behavior: "smooth"
            })
            a += 1;
            console.log(a)
            if (cardHandler(thisElement)){
                //onsole.log("trueee");
                thisElement.style.backgroundColor = "gray";
            }
            console.log(a)
        }

    }

    function c2(){
        let elements = document. getElementsByClassName("scaffold-layout__list-container");
        let c  = elements[0].children;
        for (let thisElement of c){
            if (cardHandler(thisElement)){
                let killButton = thisElement
                    .getElementsByClassName("job-card-container__action artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view")[0];
                killButton.click();
            }
        }
    }


    function howYouMatch(){
        let howYouMatch = document.getElementById("how-you-match-card-container");
        let q2 = howYouMatch.getElementsByClassName("fit-content-width text-body-medium");
        return q2[0].textContent.includes("Hirer is not accepting out of country applications.");
    }

    function language(killButton){
        browser.i18n.detectLanguage(
            document.querySelector("article").textContent
        ).then(
            (b) =>{
                if (!(b.languages[0].language === "en" || b.languages[0].language === "tr")) {
                    killButton.click();
                }
            }
        )
    }
    function crawlStep(c, index){
        if(c.length> index){
            let boy = c[index].querySelector('[data-view-name~="job-card"]');
            if (boy.ariaCurrent ==="page"){
                let killButton  =c[index].querySelector('button');
                if(killButton.ariaLabel === "Dismiss job"){ // if card is alive
                    if(howYouMatch() || cardHandler(c[index])){
                        killButton.click();
                    }else{
                        // language function is a promise, so...
                        language(killButton)
                    }
                }
                // we are done, move on
                if(c.length-1>index){
                    let target = c[index+1];
                    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                    target.querySelector('[data-view-name~="job-card"]').click();
                    setTimeout(function(){
                        return crawlStep(c, index+1)
                    }, 5000);
                }else{
                    return;
                }
            }else{
                return crawlStep(c, index+1)
            }
        }else{
            return; //list done
        }
    }

    function crawlToNext(){
        let elements = document. getElementsByClassName("scaffold-layout__list-container");
        let c  = elements[0].children;
        crawlStep(c,0);



    }

    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "c1") {
            c1();
        }else if (message.command === "c2") {
            c2();
        }else if (message.command === "c3") {
            crawlToNext();
            //c1();
        }
    });
})();