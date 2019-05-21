console.log("Hello there");

let ps = document.querySelectorAll("body div h1");

ps.forEach((p, key)=>{
  p.innerHTML += "HAHAHAH";
  console.log(p);
  console.log(key);
});
