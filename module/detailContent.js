const axios = require('axios')

const detailAnime = (id) => {
    return new Promise((resolve) => {
        axios.get(`https://api.jikan.moe/v3/anime/${id}`)
            .then(res => resolve(res))
            .catch(err => console.log(err))
    })
}

const detailFilm = (id) => {
    return new Promise((resolve) => {
        axios.get(`https://imdb-api.com/id/API/Title/k_ifzjtv65/${id}`)
            .then(res => {
                resolve(res)
                console.log(res)
            })
            .catch(err => console.log(err))
    })
}

module.exports = {
    detailAnime,
    detailFilm
}
