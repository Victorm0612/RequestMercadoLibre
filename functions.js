var client_id = "880976774391862";
var client_secret = "qCsOgLKXPHnieNz0K5ROACIQZs7wH1qC";
var redirect_uri = "https://mercadolb.herokuapp.com/";
var code, q, total=0;
var list = [];

var user = JSON.parse(localStorage.getItem("dataUser")) || {
  id_user: null,
  token: null,
};

if (user.access_token || user.user_id) {
  document.querySelector(".code").className =
    "invisible code row p-5 justify-content-center text-center";
  document.querySelector(".search").className =
    "visible search row p-5 justify-content-center text-center";
}

document.querySelector(".login").addEventListener("click", (e) => {
  e.preventDefault();
  window.open(
    `http://auth.mercadolibre.com.co/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`,
    "_blank"
  );
});

document.querySelector(".sendCode").addEventListener("click", async (e) => {
    e.preventDefault();
    code = document.getElementById("codigo").value;
    document.querySelector(".code").className =
      "invisible code row p-5 justify-content-center text-center";

    await fetch("https://api.mercadolibre.com/oauth/token", {
      body: `grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem(
          "dataUser",
          JSON.stringify({
            access_token: data.access_token,
            user_id: data.user_id,
          })
        );
        document.querySelector(".search").className =
          "visible search row p-5 justify-content-center text-center";
      })
      .catch((error) => {
        console.log(error);
      });
  });

async function buscar() {
  q = document.getElementById("busqueda").value || '1650';
  fetch(
    `https://api.mercadolibre.com/sites/MCO/search?q=${q}&sort=price_asc`,
    {
      headers: {
        Authorization: `Bearer $${user.access_token}`,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.results.filter((e) => {
        best_seller(e.seller.id, e);
      });
      document.querySelector('.buttonTable').className = 'buttonTable visible text-center'
    });
}

document.querySelector(".sendQ").addEventListener("click", (e) => {
  e.preventDefault();
  buscar();
});

async function best_seller(seller_id, element) {
  fetch(`https://api.mercadolibre.com/users/${seller_id}`, {
    headers: {
      Authorization: `Bearer $${user.access_token}`,
    },
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.seller_reputation.level_id == "5_green") {
      list.push(element);
    }
  });
}

document.querySelector('.show').addEventListener('click', (e)=>{
  e.preventDefault();
  orderByPrice(list);
  paintTable(list);
})

function orderByPrice(array){
  array.sort(function (a, b){
    if (a.price < b.price)
      return -1;
    if ( a.price > b.price )
      return 1;
    return 0;
  })
}

function paintTable(array){
  document.querySelector('#cuerpo').innerHTML =`
  <table class="table table-light">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Titulo</th>
        <th scope="col">Precio</th>
        <th scope="col">Compra</th>
      </tr>
    </thead>
    <tbody id="Incuerpo">
    </tbody>
  </table> 
  `
  for(let element of array){
    document.querySelector('#Incuerpo').innerHTML +=`
        <tr>
          <th scope="row">${element.id}</th>
          <td>${element.title}</td>
          <td>$${new Intl.NumberFormat().format(element.price)}</td>
          <td><a class="btn btn-primary" target="_blank" href="${element.permalink}">Comprar</td>
        </tr>
    `
    total +=parseInt(element.price);
  }
  total = Math.floor(total/array.length);
  fetch(`https://api.thingspeak.com/update?api_key=7GJS9PZ8CQVG3DMT&field2=${list[0].price}`,{
    method: 'GET'
  })
  .then(response => {
    return response.json();
  })
  fetch(`https://api.thingspeak.com/update?api_key=7GJS9PZ8CQVG3DMT&field1=${total}`,{
  method: 'GET'
  })
  .then(response => {
    setInterval(function(){ 
      buscar() 
      paintTable()
    }, 60000);
  })
}