const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    activity: [{
        type: String,
    }],
});

module.exports = mongoose.model('Session', SessionSchema);