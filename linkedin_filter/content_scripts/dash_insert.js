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

    const killCompanies = ["Turing", "Crossover","Canonical","Nesine.com","RemoteWorker UK"];

    function cardHandler(thisElement){
        try {
            let cn =thisElement.getElementsByClassName("job-card-container__primary-description")[0].textContent;
            let b = false;
            killCompanies.forEach(e=>{
                if (cn.includes(e)){
                    b= true;
                }
            })
            return b;
        }catch (err){
            return false;
        }

    }

    function c1(){
        let c = document. getElementsByClassName("scaffold-layout__list-container")[0].children;
        let scroller = document.getElementsByClassName("jobs-search-results-list")[0];
        let jumpDist = scroller.scrollHeight/c.length;
        var a = 0;
        for (let thisElement of c){
            scroller.scrollBy({
                top: jumpDist,
                left: 0,
                behavior: "smooth"
            })
            a += 1;
            if (cardHandler(thisElement)){
                thisElement.style.backgroundColor = "gray";
            }
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
        try{
            let howYouMatch = document.getElementById("how-you-match-card-container");
            let q2 = howYouMatch.getElementsByClassName("fit-content-width text-body-medium");
            return q2[0].textContent.includes("Hirer is not accepting out of country applications.");
        }catch (err){ // if a problem occurs check is ignored
            return false;
        }

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

    function processThis(boy){
        let killButton = boy.querySelector('button');
        try {
            if(killButton.ariaLabel === "Dismiss job"){ // if card is alive
                if(howYouMatch() || cardHandler(boy)){
                    killButton.click();
                }else{
                    // language function is a promise, so...
                    language(killButton)
                }
            }
        }
        catch(err) {
            boy.style.backgroundColor = "yellow"
            console.log("bug: "+ err.message)
        }
    }

    function crawlStep(c, index){
        if(c.length> index){
            let boy = c[index].querySelector('[data-view-name~="job-card"]');
            if (boy.ariaCurrent ==="page"){
                processThis(c[index])

                // we are done, move on
                if(c.length-1>index){
                    stepToCard(c[index+1],5000,()=>{
                        return crawlStep(c, index+1)
                    })
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

    function stepToCard(target, timeout, func){

        target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        target.querySelector('[data-view-name~="job-card"]').click();
        setTimeout(function(){
            func()
        }, timeout);
    }

    function findActiveCard(){
        let elements = document. getElementsByClassName("scaffold-layout__list-container");
        let c  = elements[0].children;
        for(let i=0;i<c.length;i++){
            if(c[i].querySelector('[data-view-name~="job-card"]').ariaCurrent){
                return {
                    item : c[i],
                    index: i
                }
            }
        }
    }


    function crawlToNext(index ){
        let elements = document. getElementsByClassName("scaffold-layout__list-container");
        let c  = elements[0].children;
        stepToCard(c[index], 5000,()=>{
            crawlStep(c, index);
        })
    }

    /**
     * Listen for messages from the background script.
     * Call "beastify()" or "reset()".
     */
    browser.runtime.onMessage.addListener((message) => {
        document.body.style.border = "10px solid yellow";
        if (message.command === "c1") {
            //c1();
            processThis(findActiveCard().item)
        }else if (message.command === "c2") {
            //c2();
            crawlToNext(findActiveCard().index);
        }else if (message.command === "c3") {

            crawlToNext(0);

            //c1();
        }
        document.body.style.border = "10px solid green";
    });
})();