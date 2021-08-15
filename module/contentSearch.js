const axios = require('axios')

const searchAnime = (q) => {
    return new Promise((resolve) => {
        axios.get(`https://api.jikan.moe/v3/search/anime?q=${q}`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

const searchFilm = (q) => {
    return new Promise((resolve) => {
        axios.get(`https://imdb-api.com/id/API/SearchTitle/k_ifzjtv65/${q}`)
        .then(res => resolve(res))
        .catch(err => console.log(err))
    })
}

module.exports = {
    searchAnime,
    searchFilm
}
