const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const cors = require('cors');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

var app = express();
app.use(express.json())
app.use(express.cors());

const PORT = 8000;

app.listen(PORT, function(){
  console.log(`Server running at port ${PORT}`);
});

//routes
app.get('/', (req, res) => {
  const {q, access_token} = req.body;
  fetch(`https://api.mercadolibre.com/sites/MCO/search?q=${q}&sort=price_asc`,
    {
      headers: {
        Authorization: `Bearer $${access_token}`,
      },
    }
  )
    .then(response => {
      return response.json();
    })
    .then(data =>{
      res.json({
        "info": data.results
      }) 
    })
})


cron.schedule('*/1 * * * *', () => {
  console.log('running a task every minute');
});