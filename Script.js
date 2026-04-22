const allQuiz = {
easy:[
{q:"Capital of India?",options:["Delhi","Mumbai","Chennai","Kolkata"],ans:"Delhi"},
{q:"2+2?",options:["3","4","5","6"],ans:"4"},
{q:"Sky color?",options:["Blue","Red","Green","Yellow"],ans:"Blue"},
{q:"National animal?",options:["Tiger","Lion","Dog","Cat"],ans:"Tiger"},
{q:"Sun rises from?",options:["East","West","North","South"],ans:"East"}
],
medium:[
{q:"Largest continent?",options:["Asia","Africa","Europe","Australia"],ans:"Asia"},
{q:"Currency of Japan?",options:["Yen","Dollar","Euro","Won"],ans:"Yen"},
{q:"Who discovered gravity?",options:["Newton","Einstein","Tesla","Edison"],ans:"Newton"},
{q:"Fastest animal?",options:["Cheetah","Tiger","Lion","Horse"],ans:"Cheetah"},
{q:"Ramayana writer?",options:["Valmiki","Tulsidas","Kalidas","Ved"],ans:"Valmiki"}
],
hard:[
{q:"Atomic no of Oxygen?",options:["6","7","8","9"],ans:"8"},
{q:"SI unit of force?",options:["Newton","Joule","Watt","Pascal"],ans:"Newton"},
{q:"First President of India?",options:["Rajendra Prasad","Nehru","Gandhi","Patel"],ans:"Rajendra Prasad"},
{q:"Longest river?",options:["Nile","Amazon","Ganga","Yangtze"],ans:"Nile"},
{q:"Telephone inventor?",options:["Bell","Edison","Tesla","Newton"],ans:"Bell"}
]
};

let level = localStorage.getItem("level") || "easy";
let quiz = allQuiz[level];

let i=0,score=0,timer,interval,selected="";

let correctSound = new Audio("./correct.mp3");
let wrongSound = new Audio("./wrong.mp3");
correctSound.onerror=()=>{};
wrongSound.onerror=()=>{};

function setLevel(l){
  localStorage.setItem("level",l);
  window.location.href="./quiz.html";
}

function load(){
  if(!document.getElementById("question")) return;

  document.getElementById("levelDisplay").innerText="Level: "+level.toUpperCase();
  document.getElementById("question").innerText=quiz[i].q;

  let opt="";
  quiz[i].options.forEach(o=>{
    opt+=`<button onclick="selectOption('${o}')">${o}</button>`;
  });
  document.getElementById("options").innerHTML=opt;

  startTimer();
  updateProgress();
}

function selectOption(o){
  selected=o;
  document.querySelectorAll("#options button").forEach(btn=>{
    btn.classList.remove("selected");
    if(btn.innerText===o) btn.classList.add("selected");
  });
}

function nextQuestion(){
  clearInterval(interval);

  document.querySelectorAll("#options button").forEach(btn=>{
    if(btn.innerText===quiz[i].ans) btn.classList.add("correct");
    else if(btn.innerText===selected) btn.classList.add("wrong");
  });

  setTimeout(()=>{
    if(selected===quiz[i].ans){score++;correctSound.play();}
    else wrongSound.play();

    i++;selected="";

    if(i<quiz.length) load();
    else{
      localStorage.setItem("score",score);
      saveLeaderboard();
      window.location.href="./result.html";
    }
  },800);
}

function startTimer(){
  timer = level==="easy"?15:level==="medium"?10:7;
  document.getElementById("timer").innerText="Time: "+timer;

  interval=setInterval(()=>{
    timer--;
    let timerEl=document.getElementById("timer");
    if(timerEl) timerEl.innerText="Time: "+timer;

    if(timer===0) nextQuestion();
  },1000);
}

function updateProgress(){
  let p=((i+1)/quiz.length)*100;
  document.getElementById("progress").style.width=p+"%";
}

function saveLeaderboard(){
  let b=JSON.parse(localStorage.getItem("board"))||[];
  b.push(score);
  b.sort((a,b)=>b-a);
  localStorage.setItem("board",JSON.stringify(b.slice(0,5)));
}

function showLeaderboard(){
  let b=JSON.parse(localStorage.getItem("board"))||[];
  let html="";
  b.forEach(s=>html+=`<li>${s}</li>`);
  document.getElementById("leaderboard").innerHTML=html;
}

if(document.getElementById("score")){
  document.getElementById("score").innerText=localStorage.getItem("score");
  showLeaderboard();
}

function restart(){window.location.href="./level.html";}
function logout(){localStorage.clear();window.location.href="./login.html";}
function toggleTheme(){document.body.classList.toggle("dark");}

load();