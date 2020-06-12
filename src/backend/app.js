const express = require('express');
require('dotenv').config()
const bcrypt = require('bcryptjs');
const cors = require('cors')
const cp = require('cookie-parser')
// My scripts
const User = require('./models/user.js');
const portfolio = require('./portfolio.js');
const apiTools = require('./apiTools.js')

const port = process.env.PORT || 3003;
const app = express();

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(cp())

app.get('/', (req, res) => {
   res.send("Hello");
});

app.post('/signup', async(req, res) => {
    const user = new User(req.body);

    try {
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        const token = await user.generateAuthToken();

        res.end();
    } catch (err) {
        res.status(400).send("sign up error");
    }
});

app.post('/login', async(req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.params.email, req.body.params.password);
        const token = await user.generateAuthToken(req.headers['user-agent']);
       
       // console.log('Logged in as ' + user.email);
      // res.cookie('token', token, {httpOnly: true, path: '/'});
      // res.cookie('id', user._id, {httpOnly: true, path: '/'});
       res.json({token: token, id: user._id });
      
    } catch (error) {
        res.send("");
    }
});

app.get('/portfolio', async(req, res)  => {
    try{
        const token = req.cookies.token
        const userId = req.cookies.id
        
        const user = await User.findById(userId)
        const isAuthenticated = await User.verifyCookie(userId, token)
        const assetPrices = await portfolio.makePriceObject(user.portfolio);
        //console.log(user.email, user.portfolio, assetPrices)
        if(isAuthenticated) res.json({email: user.email, portfolio: user.portfolio, assetPrices: assetPrices })
       // const user = await User.findOne({ _id: req.header.cookie})
      
    }
    catch(err){
        res.status(400).json({error: "Authentication error. You are not permitted to access this page. Please sign in"})
    }
   // let count_list = portfolio.getNumOfEachAsset(testfolio)
    //res.json({portfolioList: testfolio, assetPrices: pricefolio} );

});


app.patch('/users/portfolio/update', async(req, res, next) => { // update quantity
    //req.body [ticker, Number(newQuantity),Number(priceBoughtAt), id]
    try{
        const userId = req.cookies.id
        const ticker = req.body.update[0]
        const quantity = req.body.update[1]
        const priceBoughtAt = req.body.update[2]
        const user = await User.findById(userId);
       
        await user.updateOne({portfolio: portfolio.changeAssetQuantity(user.portfolio,ticker, quantity, priceBoughtAt)});
        res.end();
    }
    catch (err) {
        res.send(err)
    }
    
})

app.patch('/users/portfolio/delete', async(req, res, next) => { // delete asset
    try{
        // req.body = {delete: [Userid: string, portfolio: Object}
        const ticker = req.body.delete;
        const user = await User.findById(req.cookies.id);

        await user.updateOne({portfolio: portfolio.deleteAsset(ticker, user.portfolio)});
        res.end();
        // console.log(user.portfolio)
        // res.end();
    }
    catch (err) {
        res.send("Unable to perform operation")
    }
    
})
app.patch('/users/portfolio/add', async(req, res, next) => { // update quantity
    //req.body [ticker, Number(newQuantity),Number(priceBoughtAt), id]
    try{
        //console.log(req.body)
        const newPortfolio = req.body.ticker[1]
        const id = req.cookies.id
        const user = await User.findById(id);
        await user.updateOne({portfolio: newPortfolio});
       
        res.end();
    }
    catch (err) {
        res.send("Unable to perform operation")
    }
    
})

app.post('/users/portfolio/get-ticker', async(req, res, next) => { // update quantity
    //req.body [ticker, Number(newQuantity),Number(priceBoughtAt), id]
    try{
        let price = await apiTools.getPriceOfTicker(req.body.ticker)
        res.send({"price": price})
    }
    catch (err) {
        res.send(err)
    }
    
})
app.listen(port, () => console.log(`Port ${port}!`));