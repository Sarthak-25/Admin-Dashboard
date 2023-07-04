import express from 'express'; //for framework for api's
import bodyParser from 'body-parser'; //parsing our data coming in
import cors from 'cors'; //cross origin research sharing
import helmet from 'helmet'; //protecting the api's
import morgan from 'morgan'; //logging our api calls
import dotenv from 'dotenv';
import mongoose from 'mongoose';


import clientRoutes from "./routes/client.js";
import managementRoutes from "./routes/management.js";
import generalRoutes from "./routes/general.js";
import salesRoutes from "./routes/sales.js";

/*Data imports */
import User from './models/User.js';
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import {dataUser , dataProduct , dataProductStat , dataTransaction , dataOverallStat, dataAffiliateStat} from "./data/index.js";
/*  CONFIGURATION */

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet()); //Helmet helps you secure your Express apps by setting various HTTP headers, sets many headers which can be customized
//It is a express middleware and The top-level helmet function is a wrapper around 15 smaller middlewares.
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false})); //parser only accepts utf-8 encoding, req.body object will contain key-value pairs where value is string or array if extended is false , else any type
app.use(cors());

/*Routes */

app.use("/client", clientRoutes);
app.use("/management" , managementRoutes);
app.use("/general" , generalRoutes);
app.use("/sales" , salesRoutes);

/* MONGOOSE SETUP */


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => {
    console.log("Connected to mongoDb server...");

    /*Only add data one time */
    //AffiliateStat.insertMany(dataAffiliateStat);
    // Product.insertMany(dataProduct);
    //ProductStat.insertMany(dataProductStat);
    //Transaction.insertMany(dataTransaction);
    //OverallStat.insertMany(dataOverallStat);
    //User.insertMany(dataUser);
})
.catch((err) => console.log(`${err} Could not connect to mongoDb server`));


const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening at port ${port}`));
