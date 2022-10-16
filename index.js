let app = document.querySelector("#app");
let arr_currency = [];
let arr_names = [];
(() => {
  loader();

  function loader() {
    app.innerHTML = `<span class="loader_home">Loading</span>`;
  }

  let currencies = [];

  get_data();

  async function get_data() {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/");
      currencies = await response.json();
      obj_p(currencies);
    } catch (error) {
      loader();
    }
  }

  function obj_p(currencies) {
    for (let i = 0; i < 50; i++) {
      let obj = {};
      obj.id = currencies[i].id;
      obj.name = currencies[i].name;
      obj.symbol = currencies[i].symbol;
      arr_currency.push(obj);
    }
    // console.log(arr_currency);
    print_currencies(arr_currency);
  }

  function print_currencies(arr_currency) {
    let html = "";
    arr_currency.forEach((currency) => {
      html += `
  <div id="${currency.id}" class="card coins" style="width: 18rem;">
  <div class="card-body">
  
    <h5 class="card-title">${currency.symbol}<label class="switch">
    <input type="checkbox" id="check${currency.id}"  onclick="checkbox_add_list('${currency.id}')">
    <span class="slider round"></span>
    </label></h5>
    
    <p class="card-text">${currency.name}   </p>

    <p>
  <button onclick="get_info('${currency.id}')"    class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${currency.id}"  id=btn${currency.name}> More Info</button>
  </p>
  <div class="collapse" id="collapse_${currency.id}">
  <div class="card card-body concentration" id="info${currency.id}">
  
  </div>
  </div>

  </div>
  </div>
  `;
      arr_names.push(currency.name);
    });

    app.innerHTML = html;
  }
})();

function get_info(id) {
  // document.querySelectorAll('.collapse').hidden();
  // document.querySelector(`#collapse_${id}`).show;
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
}

async function get_info_api(id) {
  let div_info = document.querySelector(`#info${id}`);
  div_info.innerHTML = `<span class="loader"></span>`;
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    const info = await response.json();
    // console.log(info);
    print_info(info, id);
    cache(id, info);
  } catch (error) {
    console.log(error);
  }
}

function print_info(info, id) {
  let div_info = document.querySelector(`#info${id}`);
  let html = `
<img src=${info.image.small} alt=""  width="30px"/><br/>
<span> USD: ${info.market_data.high_24h.usd}&#36;</span>
<span> EUR: ${info.market_data.high_24h.eur}&#8364;</span>
<span> ILS: ${info.market_data.high_24h.ils}&#8362;</span>
`;
  div_info.innerHTML = html;
}

function cache(id, info) {
  info.time_is_up = new Date().getTime() + 120000;
  let info_json = JSON.stringify(info);
  sessionStorage.setItem(id, info_json);
}

$(function () {
  let availableTags = arr_names;
  $("#tags").autocomplete({
    source: availableTags,
  });
});

function search(){
  event.preventDefault();
  let name = $("#tags").val();
  if (name) {
    $(".coins").hide();
    arr_currency.forEach(function (currency) {
      if (currency.name === name) {
        $(`#${currency.id}`).show();
      }
    });
  } else {
    $(".coins").show();
  }
}

let arr_currency_of_reports = [];

function checkbox_add_list(id) {
  let checkbox = document.querySelector(`#check${id}`);
  if (checkbox.checked) {
    if (arr_currency_of_reports.length === 5) {
      let html = `
      <div id="pop_up">
        <p>Maximum to choose: 5</p>
        <ul id="ul_pop" class="list-group">`;
        arr_currency_of_reports.forEach(currency => {
          html += `<li class="list-group-item" >
          <input class="form-check-input me-1" type="checkbox" checked value="" id="inp_pop${currency.id}" onchange="deleting_currency_report('${currency.id}')">
          <label class="form-check-label x" for="inp_pop${currency.id}">${currency.name}</label>
          </li>`
          // document.querySelector(`#inp${currency.id}`).checked = true;
        });
            html += `</ul> <button class="btn btn-primary" onclick="close_popup()">Close</button></div>`;
      app.innerHTML += html;
      arr_currency_of_reports.forEach((currency) => (checkbox = document.querySelector(`#check${currency.id}`).checked = true));
    } else {
      arr_currency.forEach((currency) => {
        if (currency.id === id) {
          arr_currency_of_reports.push(currency);
        }
      });
    }
  } else {
    for (let i = 0; i < arr_currency_of_reports.length; i++) {
      if (arr_currency_of_reports[i].id === id) {
        arr_currency_of_reports.splice(i, 1);
      }
    }
    close_popup();
  }
}
function close_popup(){
  $("#pop_up").remove();
}
function deleting_currency_report(id) {
  let checkbox = document.querySelector(`#check${id}`);
  checkbox.checked = false;
  checkbox_add_list(id);
}

function activate_reports(){
  let get = '';  
  arr_currency_of_reports.forEach(currency => {
    get += `${currency.symbol},`
  });
  if(get){
      get.slice(0, -1);
  // get_reports(get);
  $('#app').hide();
  test(get)
  }

}

// async function get_reports(get){
//   const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${get}&tsyms=USD`);
//   const data = await response.json();
//   console.log(data);
// }

