import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async(req ,res) =>{
    try{
        const products = await Product.find();
        //I am telling mongo db that I want every product and for each product I want its stat using the product id
        //And that is known as foreign key in SQL language
        //array of objects
        const productsWithStats = await Promise.all(
            products.map(async (product) =>{
                const stat = await ProductStat.find({
                    productId : product._id
                })
                return{
                    ...product._doc,
                    stat,
                };
                //returning a mega object combining product and its stat
            })
        );
        res.status(200).json(productsWithStats);
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}

export const getCustomers = async(req , res) =>{
    try{
        const customers = await User.find({role : "user"}).select("-password");
        res.status(200).json(customers);
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}

export const getTransactions = async(req , res) =>{
    try{
        //This function is going to be tricky as we are using
        //Server side pagination...we are going to grab some values at a time but what if we are asked to sort
        //we cannot just sort the number of pages in the curr slide 
        //sort should look like this {"field" : "userId" , "sort" : "desc"}
        //Recieved from frontend
        const {page = 1 , pageSize = 20 , sort = null , search = ""} = req.query;
        //Search for searching something specific
        //formatted sort should look like this {userId : -1}
        //We want in this format
        const generateSort = () => {
            const sortParsed = JSON.parse(sort); //created object
            const sortFormatted = {
                [sortParsed.field] : (sortParsed.sort = "asc" ? 1 : -1),
            };
            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};
        const transactions = await Transaction.find({
            $or: [
                {cost : {$regex : new RegExp(search, "i")}},
                {userId : {$regex : new RegExp(search, "i")}} ,
            ],
        })
        .sort(sortFormatted)
        .skip(page*pageSize)
        .limit(pageSize);

        const total = await Transaction.countDocuments({
            name : {$regex : search , $options : "i"}
        });
        res.status(200).json({transactions , total});
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}

export const getGeography = async (req , res) =>{
    //we are going to map the details in the graph for that we will send the data
    //nivo chloropeth charts and it will send us back the chart
    //but they need information in the format {"id" : "AFG" , "value" : "2434"}
    //Notice that id contains 3 letter words but our data contains 2 letter word that means we have to convert it to
    //3 letter using the package called country-iso-2-to-3
    try{
        const users = await User.find();
        //reduce returns the accumulated value
        //Starts with an empty object and things on the way
        const mappedLocations = users.reduce((acc, {country}) =>{
            const countryISO3 = getCountryIso3(country);
            if(!acc[countryISO3]){
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        },{});

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country , count]) =>{
                return {id : country , value : count}
            }
        );
        res.status(200).json(formattedLocations);
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}