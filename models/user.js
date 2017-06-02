var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    id: String,
    username: String,
    email: String,
    password: String,
    about: String,
    address: String,
    city: String,
    first_name: String,
    last_name: String,
    company: String,
    email: String,
    country: String,
    zip: String,
    images: {
        path: Array,
        latitude: Array,
        longuitud: Array,
        temperature: Array,
        presion: Array,
        humidity: Array
    },
    videos: {
        path: Array,
        latitude: Array,
        longuitud: Array,
        temperature: Array,
        presion: Array,
        humidity: Array
    },
    notas: {
        titulo: Array,
        content: Array
    }
});