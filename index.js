require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const authRouter = require('./routes/AuthRoute');
const productRouter = require('./routes/ProductRoute');
const noteRouter = require('./routes/NoteRoute');

// Connect mongooDB
const connectDB = async () => {
    try {
        // await mongoose.connect(
        //     `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.oihuh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        //     {
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true,
        //     }
        // );

        mongoose.connect('mongodb://localhost:27017/my-web-2022');

        console.log('MongooDB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/note', noteRouter);

app.listen(4000, () => console.log('App listening on port 4000'));
