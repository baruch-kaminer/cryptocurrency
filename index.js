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
      // console.log(response);
      currencies = await response.json();

      print_currencies(currencies);
    } catch (error) {
      loader();
    }
  }

  function print_currencies(currencies) {
    let html = "";
    for (let i = 0; i < 50; i++) {
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
  <button  onclick="btn_info_this('${currencies[i].name}')" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${currencies[i].symbol}"  id=btn${currencies[i].name}> More Info</button>
  </p>
  <div class="collapse" id="${currencies[i].symbol}">
  <div class="card card-body" id="${currencies[i].name}">
  
  </div>
  </div>

  </div>
  </div>
  `;
    }



    app.innerHTML = html;
  }

  // if(info.length === 0){
  //   get_info()
  // }

  // let a = document.querySelector('.btn_info')
  // console.log(a);
  // .addEventListener('click',   btn_info_this())
  // {
  //   btn_info_this(this)
  //   console.log(this_info);

  // })
})();

// let this_info = '';
function btn_info_this(btn) {
  console.log(btn);
  let this_info = btn.toLowerCase().replace(" ", "-");
  get_info(this_info, btn);
  //  return this_info
  // console.log(this_info);
}
// console.log(this_info);

async function get_info(v, btn) {
  try {
    // let v = btn_info_this(btn)
    console.log(v);
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${v}`);
    let info = await response.json();
    print_info(info, btn);
    console.log(info);
  } catch (error) {
    console.log(error);
  }
}

function print_info(info, btn) {
  let div_info = document.querySelector(`#${btn}`);
  let html = `
  
<img src=${info.image.small} alt=""  width="30px"/>
<span> USD: ${info.tickers[2].last}</span>
<span> EUR: ${info.tickers[10].last}</span>
<span> USD: ${info.tickers[2].last}</span>
`;
  div_info.innerHTML = html;
  console.log(html);
}
