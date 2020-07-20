import React, { Component } from "react";
import "./styles/Portfolio.css";
import PortfolioTab from "./PortfolioTab";
import PortfolioForm from "./PortfolioForm";
import PortfolioValueTab from "./PortfolioValueTab";
import axios from "axios";

class Portfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolioProfile: { portfolioList: {}, assetPrices: {} },
            portfolio: [],
            portfolioTotal: 0,
            gainOrLoss: 0,
        };

        this.renderAssets = this.renderAssets.bind(this);
        this.makePortfolio = this.makePortfolio.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this);
    }
    async componentDidMount() {
        await this.setState({ portfolioProfile: this.props.profile });
        await this.makePortfolio();
        this.calculateTotalPrice();
    }

    makePortfolio() {
        let portfolioList = {}; // [ticker,quantityOwned, price]
        let id = 0;
        const listOfAssets = this.state.portfolioProfile.portfolioList;
        const listOfPrices = this.state.portfolioProfile.assetPrices;

        let totalValue = 0;
        for (let asset in listOfAssets) {
            let quantity = listOfAssets[asset][0];
            let priceBoughtAt = Number(listOfAssets[asset][1]);
            let price = listOfPrices[asset];
            let totalAssetValue = quantity * price;
            let newAssetNode = [
                quantity,
                price,
                totalAssetValue,
                priceBoughtAt,
                id,
            ];
            portfolioList[asset] = newAssetNode;
            totalValue += totalAssetValue;
            id++;
            //console.log("Node",newAssetNode)
        }
        this.setState({ portfolio: portfolioList, portfolioTotal: totalValue });
    }

    async handleEdit(ticker, newQuantity, priceBoughtAt) {
        let updatedEntry = {};
        updatedEntry["update"] = [
            ticker,
            Number(newQuantity),
            Number(priceBoughtAt),
        ];
        await axios.patch(
            `${process.env.REACT_APP_URL}/users/portfolio/update`,
            updatedEntry
        );

        let response = await axios.get(
            `${process.env.REACT_APP_URL}/portfolio`,
            { withCredentials: true }
        );
        this.setState({
            portfolioProfile: {
                portfolioList: response.data.portfolio,
                assetPrices: response.data.assetPrices,
            },
        });
        this.makePortfolio();
        this.calculateTotalPrice();
    }
    async handleAdd(ticker, quantity, priceBoughtAt) {
        //[quantity, price, totalAssetValue,priceBoughtAt, id]
        let newPortfolio = this.state.portfolio;
        let response = await axios.post(
            `${process.env.REACT_APP_URL}/users/portfolio/get-ticker`,
            { ticker: ticker, withCredentials: true }
        );
        let totalAssetValue = response.data.price * quantity;
        newPortfolio[ticker] = [
            quantity,
            response.data.price,
            totalAssetValue,
            priceBoughtAt,
            Object.keys(newPortfolio).length,
        ];
        const addObject = {};
        addObject["ticker"] = [ticker, newPortfolio];
        console.log(newPortfolio[ticker]);
        await axios.patch(
            `${process.env.REACT_APP_URL}/users/portfolio/add`,
            { withCredentials: true },
            addObject
        );
        this.setState({ portfolio: newPortfolio });
    }

    async handleDelete(id) {
        let newPortfolio = this.state.portfolio;
        let ticker = "";
        for (let asset in this.state.portfolio) {
            //can't be for ... asset in newPortfolio because of bugs when delete execs
            console.log(newPortfolio, id);
            if (newPortfolio[asset][4] === id) {
                ticker = asset;
                delete newPortfolio[asset];
            }
        }
        this.calculateTotalPrice();
        this.setState({ portfolio: newPortfolio });
        let deleteEntry = { delete: ticker };
        await axios.patch(
            `${process.env.REACT_APP_URL}/users/portfolio/delete`,
            deleteEntry
        );
    }
    calculateTotalPrice() {
        // {ticker : [quantity, price, totalAssetValue,priceBoughtAt, id]}
        const portfolio = this.state.portfolio;
        let totalValue = 0;
        let totalSpent = 0;
        for (let asset in portfolio) {
            totalValue += portfolio[asset][2];
            totalSpent += portfolio[asset][3] * portfolio[asset][0];
        }

        this.setState({
            portfolioTotal: totalValue,
            gainOrLoss: totalValue - totalSpent,
        });
    }

    renderAssets() {
        const assets = this.state.portfolio;

        return Object.keys(assets).map((asset) => (
            <PortfolioTab
                key={asset}
                id={assets[asset][4]}
                ticker={asset}
                quantity={assets[asset][0]}
                price={assets[asset][1]}
                priceBoughtAt={assets[asset][3]}
                handleEdit={this.handleEdit}
                handleDelete={this.handleDelete}
            />
        ));
    }

    render() {
        return (
            <div id="wrapper" className="Portfolio ">
                <p className="Portfolio-greeting">
                    Hello {this.props.userName}
                </p>
                <button
                    className="Portfolio-logout"
                    onClick={this.props.logout}
                >
                    Log Out
                </button>
                <h3>Your Portfolio</h3>
                <PortfolioForm
                    className="Portfolio-form"
                    handleAdd={this.handleAdd}
                />
                {this.renderAssets()}
                <br></br>
                <PortfolioValueTab
                    totalValue={this.state.portfolioTotal}
                    gainOrLoss={this.state.gainOrLoss}
                />
            </div>
        );
    }
}
export default Portfolio;
