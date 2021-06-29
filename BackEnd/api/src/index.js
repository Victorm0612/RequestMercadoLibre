const express = require('express');
const fetch = require('node-fetch');

var app = express();
app.use(express.json())

const PORT = 8000;

app.listen(PORT, function(){
  console.log(`Server running at port ${PORT}`);
});

app.post('/test_user', function(req, res){
  const {site_id} = req.body;
  fetch("https://api.mercadolibre.com/users/test_user", {
    body: {"site_id": site_id},
    headers: {
      Authorization: "Bearer $ACCESS_TOKEN",
      "Content-Type": "application/json"
    },
    method: "POST"
  })
})

app.post('/auth', function(req, res){
  const {client_id, client_secret, redirect_uri} = req.body;
  fetch("https://api.mercadolibre.com/oauth/token", {
    body: `grant_type=authorization_code&client_id=$${client_id}&client_secret=$${client_secret}&code=$code&redirect_uri=$${redirect_uri}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  })
  .then(response => {
    console.log("Request data:");
    console.log(req);
  })
  .catch(error => {
    res.status(500).json({
      message: `El error es: ${error}`
    })
  })
})

app.get('/', function(req, res){
  const {q,site_id,token} = req.body;
  axios.get(`https://api.mercadolibre.com/sites/${site_id}/search?q=${q}`, {
  headers: {
    Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    console.log(response);
  })
})