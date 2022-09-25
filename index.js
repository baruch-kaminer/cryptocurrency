(() => {
  let app = document.querySelector("#app");

  // let info = []

  loader();

  function loader() {
    app.innerHTML = `<span class="loader"></span>`;
  }

  let currencies = [];

  get_data();

  async function get_data() {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins");
      currencies = await response.json();

      print_currencies(currencies);
    } catch (error) {
      loader();
    }
  }

  function print_currencies(currencies) {
    let html = "";
    for (let i = 0; i < 50; i++) {
      html += `
  <div class="card" style="width: 18rem;">
  <div class="card-body">
  
    <h5 class="card-title">${currencies[i].symbol}<label class="switch">
    <input type="checkbox">
    <span class="slider round"></span>
    </label></h5>
    
    <p class="card-text">${currencies[i].name}   </p>

    <p>
  <button  onclick="get_info('${currencies[i].id}')" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${currencies[i].symbol}"  id=btn${currencies[i].name}> More Info</button>
  </p>
  <div class="collapse" id="${currencies[i].symbol}">
  <div class="card card-body" id="${currencies[i].id}">
  
  </div>
  </div>

  </div>
  </div>
  `;
    }



    app.innerHTML = html;
  }
})();


 function get_info(id) {
  
  if(sessionStorage.getItem(id) == null){
    
    get_info_api(id); 
  }else{
  const info_json = sessionStorage.getItem(id);
    const info =  JSON.parse(info_json)
if(info.time.getMinutes() >= info.max_time){
  if(info.time.getSeconds())
}else {}


    print_info(info, id);
    cache(id, info)
    console.log(2);

    }


}

async function get_info_api(id){
   
    console.log(1);
          try {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  const info = await response.json();
  print_info(info, id);
  cache(id, info)
} catch (error) {
  console.log(error);
}
}


function print_info(info, id) {
  let div_info = document.querySelector(`#${id}`);
  let html = `
<img src=${info.image.small} alt=""  width="30px"/><br>
<span> USD: ${info.market_data.high_24h.usd}</span><br>
<span> EUR: ${info.market_data.high_24h.eur}</span><br>
<span> ILS: ${info.market_data.high_24h.ils}</span><br>
`;
  div_info.innerHTML = html;
}

function cache(id, info){
  info.time = new Date()
  if(info.time.getMinutes() < 59 ){
   info.minute_time = info.time.getMinutes() +2
  }else if(info.time.getMinutes() = 59){
   info.max_time = 1
  }else{
   info.max_time = 2
  }
 info.seconds_time = info.time.getSeconds();

 
let info_json = JSON.stringify( info)
sessionStorage.setItem(id, info_json)
}