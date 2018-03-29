let mongoose = require('mongoose');

let ProfilesSchema = mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    avto: {
        type: Boolean,
        default: 0,
    },
    travel: {
        type: Boolean,
        default: 0,
    },
    informatic: {
        type: Boolean,
        default: 0,
    },
});

ProfilesSchema.index({
    userId: 1,
}, {unique: true});

let Profiles = mongoose.model('Profiles', ProfilesSchema);

module.exports = Profiles;