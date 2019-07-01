(function () {
    //defining browser to support chrome
    window.browser = (function () {
        return window.msBrowser ||
            window.browser ||
            window.chrome;
    })();

    //creating a meta viewport tag
    let meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1");

    //check if we are currently on the results page and render results
    if (window.location.href.includes("result") || window.location.href.includes("Result")) {
        beautify();
        showResults();
    }

    //show the result if the button in the toolbar is clicked
    function handleClick(request, sender, sendResponse) {
        if (request.action === "display") {
            beautify();
            showResults();
        }
    }

    browser.runtime.onMessage.addListener(handleClick);


    //main function to render the beautified subject list
    function beautify() {
        //check if it has already been executed
        if (window.beautifyHasLoaded) {
            return;
        }

        console.log("BEAUTIFUL IB RESULTS: %s", "beautifying");

        renderWrapper();

        //check if results have already been published
        const notification = document.querySelector("#content .notification strong") ? document.querySelector("#content .notification strong").innerText : "";
        if (notification.includes("Your results will be published on")) {
            renderNotPublishedError(notification);
            window.beautifyHasLoaded = true;
            return;
        }

        //get results from webpage
        const results = extractResults();

        //render error if no results could be found
        if (!results.success) {
            renderNoResultsError();
        } else {
            if (results.subjects.length < 1) {
                renderNoResultsError()
            } else {
                renderResults(results);
            }
        }
        window.beautifyHasLoaded = true;
    }


    //render the wrapper element
    function renderWrapper() {
        //add the wrapper template
        document.body.innerHTML += `
        <template id="template_wrapper">
            <main id="beautiful_ib_results" class="beautiful_ib_results" data-visible="false">
                <header class="header">
                    <div class="spacer"></div>
                    <h1>IB Results</h1>
                    <div class="spacer"></div>
                    <button id="close">&#10006;</button>
                </header>
            
                <section class="subject-list">
                </section>
            
                <div class="spacer"></div>
                <footer>
                    <span>Made with love by <a href="https://github.com/LeonStaufer/beautiful-results-ib">a fellow IB student</a></span>
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
                            <h3 class="subject">Subject</h3>
                            <span class="level"></span>
                        </header>
                        <div class="spacer"></div>
                        <button type="button" class="btn"><span>More</span></button>
                    </div>
                    <div class="card-face back">
                        <span class="score">5</span>
                        <div class="spacer"></div>
                        <button type="button" class="btn stroked"><span>Less</span></button>
                    </div>
                </div>
            </div>
        </template>
        `;

        //add the error template
        document.body.innerHTML += `
        <template id="template_error">
            <div class="card">
                <div class="card-inner">
                    <div class="card-face front">
                        <header class="subject-header">
                            <h3 class="subject">Error</h3>
                            <div class="spacer"></div>
                            <span class="level"></span>
                        </header>
                    </div>
                </div>
            </div>
        </template>
        `;

        //render the content of the wrapper template
        let wrapper = document.querySelector("#template_wrapper").content.cloneNode(true);
        document.body.append(wrapper);
        document.querySelector("#close").addEventListener("click", close);

        //close function
        function close() {
            //get the wrapper div element
            const results = document.querySelector(".beautiful_ib_results");

            //hide beatified results
            results.setAttribute("data-visible", "false");

            //show all other elements
            Array.from(document.querySelector("body").children).forEach(child => {
                if (child.id === "template_wrapper" || child.id === "template_subject" || child.id === "template_error" || child.id === "beautiful_ib_results") {
                    return;
                }

                child.removeAttribute("hidden");
            });

            //stop countdown
            countdown({stop: true});
        }
    }


    //render all the results
    function renderResults(results) {
        //get the element within the template which will contain the subjects
        const subject_list = document.querySelector(".subject-list");
        //get the subject template element
        const template = document.querySelector("#template_subject");

        //render passed card
        let clonePassed = template.content.cloneNode(true);

        //set the total points
        clonePassed.querySelector(".subject").textContent = "Diploma?";
        clonePassed.querySelector(".score").textContent = results.passed;

        //add toggle event listener
        clonePassed.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", toggle.bind(null, button));
        });

        //render the subject
        subject_list.append(clonePassed);


        //render total card
        let cloneTotal = template.content.cloneNode(true);

        //set the total points
        cloneTotal.querySelector(".subject").textContent = "Total";
        cloneTotal.querySelector(".score").textContent = results.total;

        //add toggle event listener
        cloneTotal.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", toggle.bind(null, button));
        });

        //render the subject
        subject_list.append(cloneTotal);


        //add divider
        let divider = document.createElement("div");
        let dividerStyled = document.createElement("div");
        dividerStyled.setAttribute("class", "divider");
        subject_list.append(dividerStyled);
        subject_list.append(divider);


        //loop through all subjects
        results.subjects.forEach(subject => {
            //create a clone of the template
            let clone = template.content.cloneNode(true);

            //change the subject, level, score values
            clone.querySelector(".subject").textContent = subject.subject;
            clone.querySelector(".level").textContent = subject.level;
            clone.querySelector(".score").textContent = subject.score;

            //add toggle event listener
            clone.querySelectorAll("button").forEach(button => {
                button.addEventListener("click", toggle.bind(null, button));
            });

            //render the subject
            subject_list.append(clone);
        });

        //toggle function
        function toggle(ctx) {
            const card = ctx.parentNode.parentNode.parentNode;
            let flipped = card.getAttribute("data-flipped");
            if (flipped === "true") {
                card.setAttribute("data-flipped", "false");
            } else card.setAttribute("data-flipped", "true");
        }
    }


    //extract results
    function extractResults() {
        let results = {
            success: false,
            subjects: []
        };

        try {
            const strongs = Array.from(document.querySelectorAll("#content p strong"));
            strongs.forEach(strong => {
                if (strong.innerText === "Results:") {
                    results.passed = strong.parentNode.lastChild.data;
                } else if (strong.innerText === "Total points:") {
                    results.total = strong.parentNode.lastChild.data;
                }
            });

            //loop over table bodies
            let table = document.querySelector("#content table");
            Array.from(table.children).forEach(child => {
                if (child.nodeName.toUpperCase() !== "TBODY") return;

                //exit if table body is empty
                if (child.children.length < 1) return;
                if (child.children[0].innerText === "None") return;

                //loop over subjects
                Array.from(child.children).forEach(subject => {
                    let name = subject.children[1].innerText;
                    let level = "";
                    let grade = subject.children[2].innerText;

                    if (name.includes("SL")) {
                        let index = name.indexOf("SL");
                        name = name.slice(0, index - 1);
                        level = "SL";
                    } else if (name.includes("HL")) {
                        let index = name.indexOf("HL");
                        name = name.slice(0, index - 1);
                        level = "HL";
                    } else if (name.includes("EE")) {
                        name = "Extended Essay";
                    } else if (name.includes("THEORY")) {
                        name = "Theory of Knowledge";
                    }

                    results.subjects.push({
                        subject: name,
                        level: level,
                        score: grade
                    });
                });
            });

            results.success = true;
            return results;
        } catch (e) {
            console.warn(e);

            results.success = false;
            return results;
        }
    }

    //render the not published error element
    function renderNotPublishedError(notification) {
        console.warn("BEAUTIFUL IB RESULTS: %s", "results not published yet");

        //extract date (+-1 accounts for spaces)
        let startIndex = notification.indexOf("published on") + "published on".length + 1;
        let endIndex = notification.indexOf("GMT") - 1;
        let dateString = notification.substring(startIndex, endIndex);

        //parse date
        let date = luxon.DateTime.fromFormat(dateString, "dd-LLLL-yyyy HH:mm:ss", {zone: "Etc/GMT"});

        //get the element within the template which will contain the subjects
        const subject_list = document.querySelector(".subject-list");
        //get the error template element
        const template = document.querySelector("#template_error");

        //create a clone of the error
        let clone = template.content.cloneNode(true);

        //change the error message
        clone.querySelector(".subject").textContent = `Results have not been published yet.`;
        //render the subject
        subject_list.append(clone);

        //start the countdown
        countdown({stop: false, end: date});
    }


    //countdown wrapper function
    function countdown(options) {
        const element = document.querySelector("#beautiful_ib_results .subject-list .card .level");

        if (options.stop) {
            clearInterval(window.beautiful_ib_results_countdown);
        } else {
            window.beautiful_ib_results_countdown = setInterval(() => {
                let now = luxon.DateTime.local();
                let difference = options.end.diff(now).toObject();
                let remaining = luxon.Duration.fromObject(difference).toFormat('dd:hh:mm:ss');

                element.innerText = `${remaining} remaining.`;
            }, 1000);
        }
    }


    //render the no results error element
    function renderNoResultsError() {
        console.warn("BEAUTIFUL IB RESULTS: %s", "no results found");

        //get the element within the template which will contain the subjects
        const subject_list = document.querySelector(".subject-list");
        //get the error template element
        const template = document.querySelector("#template_error");

        //create a clone of the error
        let clone = template.content.cloneNode(true);

        //change the error message
        clone.querySelector(".subject").textContent = `Oh no, we couldn't find the results!`;

        //render the subject
        subject_list.append(clone);
    }


    //display the results
    function showResults() {
        //get the wrapper div element
        const results = document.querySelector(".beautiful_ib_results");

        //hide all other elements
        Array.from(document.querySelector("body").children).forEach(child => {
            if (child.id === "template_wrapper" || child.id === "template_subject" || child.id === "template_error" || child.id === "beautiful_ib_results") {
                return;
            }

            child.setAttribute("hidden", "true");
        });

        //set to visible
        results.setAttribute("data-visible", "true");

        //adding meta viewport tag
        document.querySelector("head").appendChild(meta);
    }


    //scrape results from webpage
    function scrape() {
        //TODO: need access to alumni page

        return {success: false};
    }
}());