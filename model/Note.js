const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
});

module.exports = mongoose.model('notes', NoteSchema);
