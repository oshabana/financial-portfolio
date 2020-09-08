let intrinioSDK = require('intrinio-sdk');
require('dotenv').config()
intrinioSDK.ApiClient.instance.authentications['ApiKeyAuth'].apiKey = process.env.API_KEY;
let securityAPI = new intrinioSDK.SecurityApi();

let getDate = () => {
    let dateString = '';
    const date = new Date();
    let day = String(date.getDate());
    let month = String(date.getMonth())
    const year = String(date.getFullYear());
    if (day < 10){
        day = "0" + day;
    }
    if (month < 10){
        month = "0" + month;
    }
    dateString = dateString.concat(year+"-",month+"-",day)
    //dateString = dateString.concat(year+"-",day+"-",month)
    return dateString;
}

let opts = { 
    'startDate': new Date(getDate()), // Date | Return prices on or after the date
    'endDate': new Date(getDate()), // Date | Return prices on or before the date
    'frequency': "daily", // String | Return stock prices in the given frequency
    'pageSize': 100, // Number | The number of results to return
    'nextPage': null // String | Gets the next page of data from a previous API call
  };

let searchByTicker = async (ticker) => {
    ticker = ticker.toUpperCase();
    try{
        let data = await securityAPI.search_companies(ticker);
        return data
    }
    catch(err){
        console.log(ticker + " not found")
        return err
    }
}

let getPriceOfTicker = async(ticker) => {

    ticker = ticker.toUpperCase()
    const priceData = await securityAPI.getSecurityStockPrices(ticker)
    return priceData["stock_prices"][0]["close"] // res.send needs this to be a string dont forget

}


exports.searchByTicker = searchByTicker;
exports.setDate = getDate;
exports.getPriceOfTicker = getPriceOfTicker;
