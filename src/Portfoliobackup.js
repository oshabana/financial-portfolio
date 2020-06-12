import React, { Component } from 'react'
import './styles/Portfolio.css'



class Portfolio extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             portfolioProfile: {portfolioList: {}, assetPrices: []},
             portfolio: [],
             portfolioTotal: 0
        }
       this.renderAssets = this.renderAssets.bind(this)
       this.makePortfolio = this.makePortfolio.bind(this)

    }
    async componentDidMount(){
        await this.setState({portfolioProfile: this.props.profile})
        this.makePortfolio()
        let totalValue = 0;
        this.state.portfolio.map((asset => {
            totalValue += asset[1] * asset[2]
        }))
        this.setState({totalValue: totalValue})
       // console.log(this.state);
    }
    makePortfolio(){
        let portfolioList = [] // [ticker,quantityOwned, price]
        let counter = 0
        const listOfAssets = this.state.portfolioProfile.portfolioList
        const listOfPrices = this.state.portfolioProfile.assetPrices
        for (let asset in listOfAssets){
            let newAssetNode = [asset, listOfAssets[asset],listOfPrices[counter]]
            portfolioList.push(newAssetNode)
       
        }
        //console.log(pairs);
        this.setState({portfolio: portfolioList})
    
    }

    renderAssets(){
        const assets = this.state.portfolio
        //console.log(assets);
        return assets.map(asset => 
           <tr className="Portfolio-asset-block">
                    <td className="Portfolio-asset-component Portfolio-ticker">{`${asset[0]}`}</td>
                    <td className="Portfolio-asset-component Portfolio-total-owned">{`${asset[1]}`}</td>
                    <td className="Portfolio-asset-component Portfolio-total-value">{`$${asset[1] * asset[2]}`}</td>
           </tr>
        )
    }

    render() {

        return(
            <div className="Portfolio">
                <div className="Portfolio-main">
                <h3 style={{color: 'black'}}>Your Portfolio</h3>
                <table>
                    <tbody>
                        <tr>
                            <td className="Portfolio-cell">Ticker</td>
                            <td className="Portfolio-cell">Number Owned</td>
                            <td className="Portfolio-cell">Total Value</td>
                        </tr>
                        {this.renderAssets()} 
                        <br></br>  
                        <tr>
                            <td></td>
                            <td>Portfolio Value</td>
                            <td>{`$${this.state.totalValue}`}</td>
                            {console.log(this.state.totalValue)}
                        </tr>

                    </tbody>
                </table>
                </div>
            
            </div>
        )
    }
}
export default Portfolio;

