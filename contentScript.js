(function () {
    console.log("Beautifying results");

    if (window.beautifyHasLoaded){
        return;
    }
    window.beautifyHasLoaded = true;

    document.body.innerHTML += `
    <template id="template_wrapper">
        <main class="beautiful_ib_results" data-visible="true">
            <header class="header">
                <div class="spacer"></div>
                <h1>🎉IB Results🎉</h1>
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

    document.body.append(document.querySelector("#template_wrapper").content);

    const subject_list = document.querySelector(".subject-list");
    const template = document.querySelector("#template_subject");
    const results = document.querySelector(".beautiful_ib_results");

    subjects.forEach(subject => {
        let clone = template.content.cloneNode(true);

        clone.querySelector(".subject").textContent = subject.subject;
        clone.querySelector(".level").textContent = subject.level;
        clone.querySelector(".score").textContent = subject.score;

        subject_list.append(clone);
    });


    function beautify(request, sender, sendResponse) {
        results.setAttribute("data-visible", "true");
    }
    browser.runtime.onMessage.addListener(beautify);


    //export the toggle function
    function toggle(ctx) {
        const card = ctx.parentNode.parentNode.parentNode;
        let flipped = card.getAttribute("data-flipped");
        if (flipped === "true") {
            card.setAttribute("data-flipped", "false");
        } else card.setAttribute("data-flipped", "true");
    }

    function close() {
        results.setAttribute("data-visible", "false");
    }

    exportFunction(toggle, window, {defineAs: "toggle"});
    exportFunction(close, window, {defineAs: "close"});
}());