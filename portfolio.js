const User = require('./models/user.js');
const api_tools = require('./apiTools.js')

let getPortfolioByEmail = async (email) => {

    try{
        const user = await User.findOne({ "email": email });
        return user.portfolio;
    }
    catch(err){
        
        return err
    }
    
}

let makeListFromPortfolio = (portfolio) => {
    let portfolioList = [];
    for (let asset in portfolio){
        portfolioList.push(asset)
    }
    return portfolioList;
}

let makePriceObject = async (portfolio) => {
    let priceList = {};
    let listOfAssets = makeListFromPortfolio(portfolio);
    for(let i = 0; i < listOfAssets.length; i++) {
     
        try{
            priceList[listOfAssets[i]] = await api_tools.getPriceOfTicker(listOfAssets[i])
        }
        catch(err){
            console.log(err)
        }
    }
    return priceList
}
let getNumOfEachAsset = (portfolioList) => { // TODO delete or fix
    let listAssetCount = []
    for(let asset in portfolioList){
        listAssetCount.push(portfolioList[asset])
    }
  
    return listAssetCount
}

let changeAssetQuantity = (portfolio, ticker, newQuantity, priceBoughtAt) => {
    portfolio[ticker][0] = newQuantity
    portfolio[ticker][1] = priceBoughtAt
    return portfolio
}

let deleteAsset = (ticker, portfolio) => {
    delete portfolio[ticker]
    return portfolio
}

exports.getPortfolioByEmail = getPortfolioByEmail;
exports.makeListFromPortfolio = makeListFromPortfolio;
exports.makePriceObject = makePriceObject;
exports.getNumOfEachAsset = getNumOfEachAsset;
exports.changeAssetQuantity = changeAssetQuantity;
exports.deleteAsset = deleteAsset