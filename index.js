let up = document.querySelector("#up");
loader();

function loader() {
  up.innerHTML = `<span class="loader"></span>`;
}

get_data();

async function get_data() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const crypto = await response.json();
    console.log(crypto);
    let html = '';
    for (let i = 0; i < 200; i++){
         console.log(crypto[i].symbol);
      html +=      `
    <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${crypto[i].symbol}</h5>
      <p class="card-text">${crypto[i].name}</p>
      <a href="#" class="btn btn-primary">More Info</a>
    </div>
  </div>
    `;

    }
   up.innerHTML = html

  } catch (error) {
    loader();
  }
}
