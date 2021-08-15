const axios = require('axios')

const newAnime = (dateNow) => {
    return new Promise((resolve) => {
        axios.get(`https://api.jikan.moe/v3/season/${dateNow.year}/${dateNow.season}`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

const newFilm = () => {
    return new Promise((resolve) => {
        axios.get(`https://imdb-api.com/en/API/BoxOffice/k_ifzjtv65`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

module.exports = {
    newAnime,
    newFilm
}
