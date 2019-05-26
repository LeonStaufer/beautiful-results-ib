(function () {
    //defining browser to support chrome
    window.browser = (function () {
        return window.msBrowser ||
            window.browser ||
            window.chrome;
    })();

    //check if we are currently on the results page and render results
    if (window.location.href.includes("result") || window.location.href.includes("Result")) {
        renderBeautify();
        showResults();
    }

    //show the result if the button in the toolbar is clicked
    function handleClick(request, sender, sendResponse) {
        if (request.action === "display") {
            renderBeautify();
            showResults();
        }
    }
    browser.runtime.onMessage.addListener(handleClick);


    //main function to render the beautified subject list
    function renderBeautify(){
        //check if it has already been executed
        if (window.beautifyHasLoaded){
            return;
        }

        console.log("BEAUTIFUL IB RESULTS: %s", "beautifying");
        window.beautifyHasLoaded = true;

        //add the wrapper template
        document.body.innerHTML += `
        <template id="template_wrapper">
            <main class="beautiful_ib_results" data-visible="false">
                <header class="header">
                    <div class="spacer"></div>
                    <h1>IB Results</h1>
                    <div class="spacer"></div>
                    <button id="close" onclick="window.close()">&#10006;</button>
                </header>
            
                <section class="subject-list">
                </section>
            
                <div class="spacer"></div>
                <footer>
                    <span>Made with love by a fellow IB student</span>
                </footer>
            </main>
        </template>
        `;

        //add the subject template
        document.body.innerHTML += `
        <template id="template_subject">
            <div class="card" data-flipped="false">
                <div class="card-inner">
                    <div class="card-face front">
                        <header class="subject-header">
                            <h3 class="subject">English A: Language and Literature</h3>
                            <span class="level">SL</span>
                        </header>
                        <div class="spacer"></div>
                        <button type="button" class="btn" onclick="window.toggle(this)"><span>More</span></button>
                    </div>
                    <div class="card-face back">
                        <span class="score">5</span>
                        <div class="spacer"></div>
                        <button type="button" class="btn stroked" onclick="window.toggle(this)"><span>Less</span></button>
                    </div>
                </div>
            </div>
        </template>
        `;

        //demo content
        const subjects = [{
            subject: "English A: Language and Literature",
            level: "HL",
            score: 6
        },
            {
                subject: "Mathematics",
                level: "SL",
                score: 5
            },
            {
                subject: "Physics",
                level: "HL",
                score: 1
            },
            {
                subject: "German A: Language and Literature",
                level: "SL",
                score: 4
            },
            {
                subject: "Computer Science",
                level: "HL",
                score: 5
            },
            {
                subject: "Business Management",
                level: "HL",
                score: 3
            },
            {
                subject: "Theory of Knowledge",
                score: "B"
            },
            {
                subject: "Extended Essay",
                level: "Computer Science",
                score: "A"
            }];


        //render the content of the wrapper template
        document.body.append(document.querySelector("#template_wrapper").content);

        //get the element within the template which will contain the subjects
        const subject_list = document.querySelector(".subject-list");
        //get the subject template element
        const template = document.querySelector("#template_subject");
        //get the wrapper div element
        const results = document.querySelector(".beautiful_ib_results");

        //loop through all subjects
        subjects.forEach(subject => {
            //create a clone of the
            let clone = template.content.cloneNode(true);

            //change the subject, level, score values
            clone.querySelector(".subject").textContent = subject.subject;
            clone.querySelector(".level").textContent = subject.level;
            clone.querySelector(".score").textContent = subject.score;

            //render the subject
            subject_list.append(clone);
        });

        //export the toggle function
        function toggle(ctx) {
            const card = ctx.parentNode.parentNode.parentNode;
            let flipped = card.getAttribute("data-flipped");
            if (flipped === "true") {
                card.setAttribute("data-flipped", "false");
            } else card.setAttribute("data-flipped", "true");
        }
        exportFunction(toggle, window, {defineAs: "toggle"});

        //export the close function
        function close() {
            results.setAttribute("data-visible", "false");
        }
        exportFunction(close, window, {defineAs: "close"});
    }

    //display the results
    function showResults() {
        //get the wrapper div element
        const results = document.querySelector(".beautiful_ib_results");

        //set to visible
        results.setAttribute("data-visible", "true");
    }
}());