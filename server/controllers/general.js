import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";



export const getUser = async(req , res) =>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}

export const getDashboard = async (req , res) =>{
    try{
        const currYear = 2021;
        const currMonth = "November";
        const currDay = "2021-11-15";

        /*Recent transactions */
        const transactions = await Transaction.find().limit(50).sort({createdOn : -1});

        /*OverallStats*/
        const overallStat = await OverallStat.find({year : currYear});

        const {totalCustomers, yearlySalesTotal , yearlyTotalSoldUnits , monthlyData, salesByCategory} = overallStat[0];
        
        const thisMonthStats = overallStat[0].monthlyData.find(({month}) =>{
            return month === currMonth;
        })

        const todayStats = overallStat[0].dailyData.find(({date}) =>{
            return date === currDay;
        })

        res.status(200).json({totalCustomers, yearlySalesTotal , yearlyTotalSoldUnits , monthlyData, salesByCategory,transactions, thisMonthStats , todayStats});
        
    }
    catch(error){
        res.status(404).json({message : error.message});
    }
}