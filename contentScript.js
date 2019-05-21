console.log("Hello there");

document.body.innerHTML += `
<template id="template">
  <main class="beautiful_ib_results">
      <button id="close">X</button>
      <header class="header">
          <h1>IB Results</h1>
      </header>
  
      <section class="subject-list">
          <div class="card" data-flipped="false">
              <div class="card-inner">
                  <div class="card-face front">
                      <header class="subject-header">
                          <h3>English A: Language and Literature</h3>
                          <span>SL</span>
                      </header>
                      <div class="spacer"></div>
                      <button type="button" name="button" onclick="toggle()">More</button>
                  </div>
                  <div class="card-face back">
                      <span>5</span><span>/7</span>
                      <div class="spacer"></div>
                      <button type="button" name="button" onclick="toggle()">Less</button>
                  </div>
              </div>
          </div>
      </section>
  </main>
</template>
`;

const template = document.querySelector("#template");
document.body.append(template.content);


function toggle() {
  const card = document.querySelector(".card");
  let flipped = card.getAttribute("data-flipped");
  if (flipped === "true") {
    card.setAttribute("data-flipped", "false");
  } else card.setAttribute("data-flipped", "true");
}