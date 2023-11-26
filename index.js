const app = document.querySelector("#app");
const my_chart = document.querySelector("#chartContainer");
const btn_home = document.querySelector('#btn_home'); 
const btn_reports = document.querySelector('#btn_reports'); 
const arr_coins = [];
const coins_of_reports = [];
const url = "https://api.coingecko.com/api/v3/coins/";
// (() => {
my_chart.style.display = "none";
display_loader();

function display_loader() {
  app.innerHTML = `<div class="concentration"><span class="loader_home">Loading</span></div>`;
};

let currencies = [];

setTimeout(() => {
  get_data();
}, 1500);

async function get_data() {
  try {
    const response = await fetch(url);
    currencies = await response.json();
    obj_coins(currencies);
  } catch (error) {
    display_loader();
  }
};

function obj_coins(currencies) {
  for (let i = 0; i < 50; i++) {
    let obj = {};
    obj.id = currencies[i].id;
    obj.name = currencies[i].name;
    obj.symbol = currencies[i].symbol;
    arr_coins.push(obj);
  }
  print_currencies(arr_coins);
};

function print_currencies(arr_coins, i) {
  (i) && active(btn_home); 
  let html = '<section id="home_coins">';
  arr_coins.forEach((coins) => {
    html += `
  <div id="${coins.id}" class="card coins" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${coins.symbol.toUpperCase()}<label class="switch">
    <input type="checkbox" id="check${coins.id}"  onclick="checkbox_add_list('${coins.id}')">
    <span class="slider round"></span>
    </label></h5>
    <p class="card-text">${coins.name}   </p>
    <p><button onclick="get_info('${coins.id}')"    
  class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${coins.id}" 
   id=btn${coins.name}> More Info</button> </p>
  <div class="collapse " id="collapse_${coins.id}">
  <div class="card card-body concentration" id="info${coins.id}">
  </div> </div> </div> </div>
  `;
  });
  html += '</section>'
  app.innerHTML = html;
  
  for(let i = 0; i < coins_of_reports.length; i++){
    arr_coins.forEach(coins => {
      let checkbox = document.querySelector(`#check${coins.id}`);
     coins.id === coins_of_reports[i].id && (checkbox.checked = true );
  });
  }
};
// })();

function get_info(id) {
  if (sessionStorage.getItem(id) === null) {
    get_info_api(id);
  } else {
    const info_json = sessionStorage.getItem(id);
    const info = JSON.parse(info_json);
    let time_now = new Date().getTime();
    if (time_now < info.time_is_up) {
      print_info(info, id);
      cache(id, info);
    } else {
      get_info_api(id);
    }
  }
};

async function get_info_api(id) {
  let div_info = document.querySelector(`#info${id}`);
  div_info.innerHTML = `<span class="loader"></span>`;
  try {
    const response = await fetch(url + id);
    const info = await response.json();
    print_info(info, id);
    cache(id, info);
  } catch (error) {
    div_info.innerHTML = `<span class="loader"></span>`;
  }
};

function print_info(info, id) {
  let div_info = document.querySelector(`#info${id}`);
  let html = `
<img src=${info.image.small} alt=""  width="30px"/><br/>
<span> USD: ${info.market_data.high_24h.usd}&#36;</span>
<span> EUR: ${info.market_data.high_24h.eur}&#8364;</span>
<span> ILS: ${info.market_data.high_24h.ils}&#8362;</span>
`;
  div_info.innerHTML = html;
};

function cache(id, info) {
  info.time_is_up = new Date().getTime() + 120000;
  let info_json = JSON.stringify(info);
  sessionStorage.setItem(id, info_json);
};


function search() {
  event.preventDefault();
  display(btn_home);
  const name_coins = $("#tags");
  const coins = $(".coins");
  if (name_coins.val()) {
    coins.hide();
    arr_coins.forEach(coins => coins.symbol === name_coins.val() && $(`#${coins.id}`).show());
  }
  name_coins.val("");
};

document.querySelector('#tags').addEventListener('focus', () => {
  let arr = [];
  arr_coins.forEach(e => {
    arr.push(e.symbol);
  });
  let availableTags = arr;
  $("#tags").autocomplete({
    source: availableTags,
  });
});


function checkbox_add_list(id) {
  let checkbox = document.querySelector(`#check${id}`);
  if (checkbox.checked) {
    if (coins_of_reports.length === 5) {
      console.log(display_popup());
      app.innerHTML += display_popup(id);
      coins_of_reports.forEach((coins) => (checkbox = document.querySelector(`#check${coins.id}`).checked = true));
    } else {
      arr_coins.forEach((coins) => coins.id === id && coins_of_reports.push(coins));
    }
  } else {
    coins_of_reports.forEach((coins, i) => coins.id === id && coins_of_reports.splice(i, 1));
    close_popup();
  }
};

function display_popup(id){
  let html = `
  <section class ="concentration">
  <div id="pop_up">
    <p>Maximum To Choose: 5</p>
    <ul id="ul_pop" class="list-group">`;
  coins_of_reports.forEach((coins) => {
    html += `<li class="list-group-item" >
      <input class="form-check-input me-1" type="checkbox" checked value="" id="inp_pop${coins.id}" onchange="deleting_coins_report('${coins.id}', '${id}')">
      <label class="form-check-label pointer" for="inp_pop${coins.id}">${coins.name}</label>
      </li>`;
  });
  html += `</ul> <button class="btn btn-primary" onclick="close_popup()">Close</button></div> </section>`;
  return html;
};

function close_popup() {
  $("#pop_up").remove();
};

function deleting_coins_report(id, elm) {
  document.querySelector(`#check${id}`).checked = false;
  document.querySelector(`#check${elm}`).checked = true;
  checkbox_add_list(id);
  checkbox_add_list(elm)
};

function activate_reports() {
  const arr_names = [];
  let get = "";
  coins_of_reports.forEach((coins) => {
    get += `${coins.symbol},`;
    arr_names.push(coins.symbol);
  });
  if((!get)){
    alert('add currencies to the report!');
    return;
  }
  active(btn_reports);
  get.slice(0, -1);
  document.body.style.backgroundImage = "none";
  chart_activation(get, arr_names);
};

function display_about() {
  let b = document.querySelector('#btn_about'); 
  active(b)
  return `
  <section id="about" class="concentration">
  <img src="./images/nft-_background.png" alt="logo" width="130">
    <h2 > CRYPTONITE</h2>
    <span class="separator"></span>
    <p>In this application you will receive information about digital currencies, currency prices in dollars, euros and shekels.</p> <p> You can add coins to a data chart that displays live coin prices.</p>
    <span class="separator"></span>
    <p>My name is Baruch Kaminer and i am a front-end developer, an expert in building websites and applications and i have extensive experience and knowledge in innovative technologies and many programming languages. i developed this site using html, css, javascript and jQury.</p>
    <span class="separator"></span>
    <p id="contact">Contact me by email: <a href="mailto:b60617@gmail.com">B60617@gmail.com</a> </p>
</section>`;
};

function display(e) {
  e.id === "btn_home" ? print_currencies(arr_coins, e) : (app.innerHTML = display_about());
  my_chart.style.display = "none";
  app.style.display = "block";
};

function active(e){
  document.querySelectorAll('nav  a').forEach(e => e.classList.remove('active'));
  e.classList.add('active');
}

document.querySelector('h1').addEventListener('click', () => location.reload() );
document.querySelector('#btn_search').addEventListener('click', search);
btn_reports.addEventListener('click', activate_reports);