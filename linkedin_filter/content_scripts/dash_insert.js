var record_text = "";

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
            if(killButton.ariaLabel.includes("Dismiss")){ // if card is alive
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

    function crawlStep(c, index, processFunction, finalFunction){
        if(c.length> index){
            let boy = c[index].querySelector('[data-view-name~="job-card"]');
            if (boy.ariaCurrent ==="page"){
                processFunction(c[index])

                // we are done, move on
                if(c.length-1>index){
                    stepToCard(c[index+1],5000,()=>{
                        return crawlStep(c, index+1, processFunction, finalFunction)
                    })
                }else{
                    finalFunction();
                    return;
                }
            }else{
                return crawlStep(c, index+1, processFunction, finalFunction)
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


    function crawlToNext(index, timeout, processFunction, finalFunction ){
        let elements = document. getElementsByClassName("scaffold-layout__list-container");
        let c  = elements[0].children;
        stepToCard(c[index], timeout,()=>{
            crawlStep(c, index, processFunction, finalFunction);
        })
    }

    function record(text, filename){
        var tempLink = document.createElement("a");
        //const link = document.querySelector('a.simple');


        var textBlob = new Blob([text], {type: 'text/plain'});

        tempLink.setAttribute('href', URL.createObjectURL(textBlob));

        tempLink.setAttribute('download', filename+".txt");

        tempLink.click()

        URL.revokeObjectURL(tempLink.href);

        tempLink.remove()
    }


    function cardText(boy){
        let b1  =boy.getElementsByClassName("flex-grow-1 artdeco-entity-lockup__content ember-view")[0]
        let l0 = "job: "+ b1.children[0].textContent.trim() + ";\n"
        let l1 = "com: "+ b1.children[1].textContent.trim() + ";\n"
        let l2 = "loc: "+ b1.children[2].textContent.trim() + ";\n"
        let l3 = "res: "+ b1.children[3].textContent.split(";\n").map( (item)=>{return item.trim()} ).filter((a)=>a.length>0).join(", ") + "\n"

        return l0 + l1 + l2 + l3;
    }

    function bigText(){
        let home = document.getElementsByClassName("jobs-details__main-content jobs-details__main-content--single-pane full-width")[0]
        let big1 = home.getElementsByClassName("jobs-unified-top-card t-14")[0].textContent.split("\n").map((a)=>a.trim()).filter((a)=>a.length).join(", ")
        let h2 = home.getElementsByClassName("mh4 pt4 pb3");
        let big2 = "";
        if (h2.length){
            big2 = h2[0].textContent.split("\n").map((a)=>a.trim()).filter((a)=>a.length).join(", ")
        }
        let big3 = home.getElementsByClassName("jobs-description__content jobs-description-content")[0].children[0].children[1].textContent.trim()
        let h4 = home.getElementsByClassName("job-details-how-you-match-card__header pt5 ph5 pb5")
        let big4 = "";
        if (h4.length){
            big4=h4[0].textContent.split("\n").map((a)=>a.trim()).filter((a)=>a.length).join(", ")
        }
        return  big1 + ";\n" + big2 + ";\n" + big3 + ";\n" + big4 + ";\n"
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
            document.body.style.border = "10px solid green";
        }else if (message.command === "c2") {
            //c2();
            crawlToNext(findActiveCard().index, 5000,processThis, ()=>{
                document.body.style.border = "10px solid green";
            });
        }else if (message.command === "c3") {

            crawlToNext(0,5000, processThis, ()=>{
                document.body.style.border = "10px solid green";
            });

            //c1();
        }
        else if (message.command === "c4") {
            record_text = "";
            crawlToNext(0,1000, (boy)=>{
                let killButton = boy.querySelector('button');
                if(killButton.ariaLabel.includes("Dismiss")) { // if card is alive
                    record_text += "****\n";
                    record_text += cardText(boy)
                    record_text += bigText()
                }else{
                }
            }, ()=>{

                const now = new Date();
                let p1 = (now.getFullYear()-2000) + String(now.getMonth()).padStart(2,"0")+ String(now.getMonth()).padStart(2,"0")
                let p2 = String(now.getHours()).padStart(2,"0") + String(now.getMinutes()).padStart(2,"0")

                record(record_text, p1+"_"+p2)
                //record_text = "";
                document.body.style.border = "10px solid green";
            })

            //top part: jobs-unified-top-card t-14
            // hirer: mh4 pt4 pb3
            // desc: jobs-description__content jobs-description-content
            //crawlToNext(0);

            // temp2.textContent.split("\n").map((a)=>a.trim()).filter((a)=>a.length)
            //c1();
        }

    });
})();