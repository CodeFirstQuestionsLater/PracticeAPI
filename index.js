require('dotenv').config(); // adds the .env variables
const axios = require('axios'); // for pulling the webpages
const express = require('express'); // for hosting the api for query
const cheerio = require('cheerio'); // for parsing the html data
const res = require('express/lib/response'); 
const { response } = require('express');

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }
]

const app = express();  // for more easily using express
const PORT = process.env.PORT // express port
const articles = [] // the array that the data is going into

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    }).catch(err => console.log(err))
})

app.get('/news', (req, res) => { // the page for the api for the articles
    res.json(articles)
})

app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
    // axios.get()
})

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));

