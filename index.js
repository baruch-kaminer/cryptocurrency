(()=>{


  let up = document.querySelector("#up");

  let info = []



loader();

function loader() {
  up.innerHTML = `<span class="loader"></span>`;
}

let currencies = [];

get_data();

async function get_data() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins");
    // console.log(response);
    currencies = await response.json();



    let html = "";
    for (let i = 0; i < 20; i++) {
      // console.log(crypto[i].symbol);
      html += `
    <div class="card" style="width: 18rem;">
    <div class="card-body">
    
      <h5 class="card-title">${currencies[i].symbol}<label class="switch">
      <input type="checkbox">
      <span class="slider round"></span>
      </label></h5>
      
      <p class="card-text">${currencies[i].name}   </p>

      <p>
  <button  class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${
    currencies[i].symbol
  }"  id=btn${currencies[i].symbol}  >
    More Info
  </button>
</p>
<div class="collapse" id="${currencies[i].symbol}">
  <div class="card card-body">
  <img src=${info.image.small} alt=""  width="30px"/>
  <span> USD: ${info.tickers[2].last}</span>
  <span> EUR: ${info.tickers[10].last}</span>
  <span> USD: ${info.tickers[2].last}</span>
  </div>
</div>

    </div>
  </div>
    `;
    }

    up.innerHTML = html;
  } catch (error) {
    loader();
  }
}



if(info.length === 0){
  get_info()
}

async function get_info() { 
     
  try {
const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum`);
     info = await response.json();
    console.log(info);
  } catch (error) {
    console.log(error);
  };
};





})()
