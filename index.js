require('dotenv').config(); // adds the .env variables
const axios = require('axios'); // for pulling the webpages
const express = require('express'); // for hosting the api for query
const cheerio = require('cheerio'); // for parsing the html data
const res = require('express/lib/response'); 
const { response } = require('express');

const app = express();  // for more easily using express
const PORT = process.env.PORT // express port
const URL = process.env.URL // the url that's being parsed
const articles = [] // the array that the data is going into

app.get('/', (req, res) => { // the main page of the api. 
    res.json('Welcome to my AJC API')
})

app.get('/news', (req, res) =>{ // the page for the api for the articles
    axios.get(`${URL}`)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("COVID")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url
                })
            })
            res.json(articles)
        }).catch(err => console.log(err))
})

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));

