require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const { searchFilm, searchAnime } = require('./module/contentSearch')
const { detailAnime, detailFilm } = require('./module/detailContent')
const { topAnime, topFilm } = require('./module/bestTop')
const { newAnime, newFilm } = require('./module/newLatest')
const Telegram = require("node-telegram-bot-api")
const BOT_TOKEN = process.env.TOKEN
const bot = new Telegram(BOT_TOKEN, { polling : true })

//morning-woodland-17013
//https://morning-woodland-17013.herokuapp.com/
var command = false, _searchAnime = false, _searchFilm = false
bot.on('message', (msg) => {
    switch (msg.text.toString().toLowerCase()) {
        case "/start":
            bot.sendMessage(msg.chat.id, `<b>Selamat Datang</b>\n\n<b>Pembuat Bot :</b> Ivan Faathirza - 10119003\n\n<b>Link Github : </b> <a href="https://github.com/ivan0811">Ivan0811</a> \n\n<b>Fitur :</b> \n<b>/menu</b> (untuk memilih menu)\n<b>/detailBot</b> (tentang bot)`, { parse_mode: "HTML" })
            break;
        case "/menu":
            bot.sendMessage(msg.chat.id, "Silahkan Pilih Menu", {
                "reply_markup": {
                    "keyboard": [['Pencarian'], ['Terpopuler'], ['Terbaru']],
                    "one_time_keyboard": true
                }
            });
            break;
        case "/detailbot":
            bot.sendMessage(msg.chat.id, `<b>Tentang Bot</b>\nBot ini digunakan untuk mencari film atau anime\n\n<b>Api Telegram : </b><a href="https://github.com/yagop/node-telegram-bot-api">node-telegram-bot-api</a> \n\n<b>Api Film :</b> <a href="https://imdb-api.com/">IMDB-API</a>\n\n<b>Api Anime :</b> <a href="https://jikan.moe/">Jikan-API</a>`, { parse_mode: "HTML" })
            break;
        case "pencarian":
            bot.sendMessage(msg.chat.id, "Pencarian :", {
                "reply_markup": {
                    "keyboard": [['Cari Film'], ['Cari Anime']],
                    "one_time_keyboard": true
                }
            });
            break;
        case "terpopuler":
            bot.sendMessage(msg.chat.id, "Terpopuler :", {
                "reply_markup": {
                    "keyboard": [['Film Terpopuler'], ['Anime Terpopuler']],
                    "one_time_keyboard": true
                }
            });
            break;
        case "terbaru":
            bot.sendMessage(msg.chat.id, "Terbaru :", {
                "reply_markup": {
                    "keyboard": [['Film Box Office'], ['Anime Musim Sekarang']],
                    "one_time_keyboard": true
                }
            });
            break;
        case "cari film":
            bot.sendMessage(msg.chat.id, `Silahkan Masukkan kata kunci film`)
            command = true
            _searchFilm = true
            break;
        case "cari anime":
            bot.sendMessage(msg.chat.id, `Silahkan Masukkan kata kunci anime`)
            command = true
            _searchAnime = true
            break;
        case "film terpopuler":
            bot.sendMessage(msg.chat.id, `Loading...`)
            top_film()
            async function top_film() {
                await topFilm()
                    .then(res => {
                        const data = res.data.items
                        let result = ''
                        data.forEach((item, i) => {
                            if (i < 30) {
                                result += `<b>Judul : </b>${item.title}\n<b>Rank :</b>${item.rank}\n<b>Selengkapnya : </b>/detail_film${item.id}\n\n`
                            }
                        })
                        bot.sendMessage(msg.chat.id, `<b>Film Terpopuler :</b> \n\n ${result}`, {
                            parse_mode: "HTML",
                        })
                    }).catch(err => console.log(err))

            }
            break;
        case "anime terpopuler":
            bot.sendMessage(msg.chat.id, `Loading...`)
            top_anime()
            async function top_anime() {
                await topAnime()
                    .then(res => {
                        const data = res.data.top
                        let result = ''
                        data.forEach((item, i) => {
                            if (i < 30) {
                                result += `<b>Judul : </b>${item.title}\n<b>Rank :</b>${item.rank}\n<b>Selengkapnya : </b>/detail_anime${item.mal_id}\n\n`
                            }
                        })
                        bot.sendMessage(msg.chat.id, `<b>Anime Terpopuler :</b> \n\n ${result}`, {
                            parse_mode: "HTML",
                        })
                    }).catch(err => console.log(err))

            }
            break;
        case "anime musim sekarang":
            bot.sendMessage(msg.chat.id, `Loading...`)
            new_anime()
            async function new_anime() {
                const musim = {
                    winter: 'Dingin',
                    fall: 'Gugur',
                    spring: 'Semi',
                    summer: 'Panas'
                }
                let date = new Date()
                let season = ''
                switch (date.getMonth().toString()) {
                    case '12':
                    case '1':
                    case '2':
                        season = 'winter';
                        break;
                    case '3':
                    case '4':
                    case '5':
                        season = 'spring';
                        break;
                    case '6':
                    case '7':
                    case '8':
                        season = 'summer';
                        break;
                    case '9':
                    case '10':
                    case '11':
                        season = 'fall';
                        break;
                }
                await newAnime({ year: date.getFullYear(), season })
                    .then(res => {
                        const data = res.data.anime
                        let result = ''
                        data.forEach((item, i) => {
                            if (i < 30) {
                                result += `<b>Judul : </b>${item.title}\n<b>Selengkapnya : </b>/detail_anime${item.mal_id}\n\n`
                            }
                        })
                        bot.sendMessage(msg.chat.id, `<b>Anime Musim ${musim[season]} Tahun ${date.getFullYear()} :</b> \n\n ${result}`, {
                            parse_mode: "HTML",
                        })
                    }).catch(err => console.log(err))
            }
            break;
        case "film box office":
            bot.sendMessage(msg.chat.id, `Loading...`)
            new_film()
            async function new_film() {
                await newFilm()
                    .then(res => {
                        const data = res.data.items
                        let result = ''
                        data.forEach((item, i) => {
                            if (i < 30) {
                                result += `<b>Judul : </b>${item.title}\n<b>Selengkapnya : </b>/detail_film${item.id}\n\n`
                            }
                        })
                        bot.sendMessage(msg.chat.id, `<b>Film Box Office :</b> \n\n ${result}`, {
                            parse_mode: "HTML",
                        })
                    }).catch(err => console.log(err))
            }
            break;
        default:
            if (/\/detail/ig.test(msg.text.toString())) command = true
            if (command) {
                if (/\/detail_anime\d/ig.test(msg.text.toString())) {
                    detail_anime(msg.text.toString().match(/\d/g).join(''))
                    async function detail_anime(id) {
                        await detailAnime(id)
                            .then(res => {
                                const data = res.data
                                let genres = data.genres.map(item => item.name).join(', ')
                                bot.sendPhoto(msg.chat.id, data.image_url);
                                bot.sendMessage(msg.chat.id,
                                    `<b>Title : </b>${data.title}\n<b>Score : </b>${data.score}\n<b>Rank : </b>${data.rank}\n<b>Episode : </b>${data.episodes}\n<b>Status : </b>${data.status}\n<b>Release : </b>${data.aired.string}\n<b>Rating : </b>${data.rating}\n<b>Duration : </b>${data.duration}\n<b>Genres : </b>\n${genres}`, {
                                    parse_mode: "HTML",
                                })
                            }).catch(err => console.log(err))
                    }
                }
                if (/\/detail_film/ig.test(msg.text.toString())) {
                    detail_film(msg.text.toString().replace(/\/detail_film/gi, ''))
                    async function detail_film(id) {
                        await detailFilm(id)
                            .then(res => {
                                const data = res.data
                                if (data.title == null) {
                                    bot.sendMessage(msg.chat.id, `Data Tidak Ditemukan`)
                                } else {
                                    bot.sendPhoto(msg.chat.id, data.image);
                                    bot.sendMessage(msg.chat.id,
                                        `<b>Title : </b>${data.title}\n<b>Score : </b>${data.imDbRating}\n<b>Release : </b>${data.releaseDate}\n<b>Duration : </b>${data.runtimeMins}\n
                                    ${data.plotLocal}`, {
                                        parse_mode: "HTML",
                                    })
                                }
                            }).catch(err => console.log(err))
                    }
                }

                if (_searchFilm) {
                    search_film(msg.text.toString().toLowerCase())
                    async function search_film(keyword) {
                        await searchFilm(keyword)
                            .then(res => {
                                let data = ''
                                res.data.results.forEach(item => {
                                    data += `<b>Judul : </b>${item.title}\n<b>Selengkapnya :</b> /detail_film${item.id}\n\n`
                                });
                                bot.sendMessage(msg.chat.id, `<b>Judul yang terkait:</b> \n\n ${data}`, {
                                    parse_mode: "HTML",
                                })
                            }).catch(err => console.log(err))
                        _searchFilm = false
                    }
                }
                if (_searchAnime) {
                    search_anime(msg.text.toString().toLowerCase())
                    async function search_anime(keyword) {
                        await searchAnime(keyword)
                            .then(res => {
                                let data = ''
                                res.data.results.forEach(item => {
                                    data += `<b>Judul : </b>${item.title}\n<b>Selengkapnya :</b> /detail_anime${item.mal_id}\n\n`
                                });
                                bot.sendMessage(msg.chat.id, `<b>Judul yang terkait:</b> \n\n ${data}`, {
                                    parse_mode: "HTML",
                                })
                            })
                            .catch(err => console.log(err))
                        _searchAnime = false
                    }
                }
            }

            if (!command) bot.sendMessage(msg.chat.id, `Perintah tidak ditemukan`)
            break;
    }
})