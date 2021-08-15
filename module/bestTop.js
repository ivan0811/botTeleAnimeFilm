const axios = require('axios')

const topAnime = (q) => {
    return new Promise((resolve) => {
        axios.get(`https://api.jikan.moe/v3/top/anime/1`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

const topFilm = (q) => {
    return new Promise((resolve) => {
        axios.get(`https://imdb-api.com/en/API/MostPopularMovies/k_ifzjtv65`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

module.exports = {
    topFilm,
    topAnime
}
