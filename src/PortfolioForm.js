import React, { Component } from 'react'
import './styles/PortfolioForm.css'
import {listOfAvailableTickers} from './tickers'

class PortfolioForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
             ticker: "MRK",
             quantity: 1,
             priceBoughtAt: 0
        }
        this.onValueChange = this.onValueChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }
 
    submitForm(e){
        e.preventDefault()
        const ticker = this.state.ticker
        if(listOfAvailableTickers.includes(ticker)){
            this.props.handleAdd(ticker, this.state.quantity, this.state.priceBoughtAt)

        }
        else{
            alert("This ticker is not available please enter one from this list:\n\n https://product.intrinio.com/developer-sandbox/coverage/us-fundamentals-financials-metrics-ratios-stock-prices\n\n For example try: 'MRK'")
        }


    }

    onValueChange(e){
        this.setState({[e.target.name]: (e.target.name === 'ticker') ? e.target.value.toUpperCase() : e.target.value})
    }

    render(){
        return(
            <div className="Portfolio-form">
                <a href={"https://product.intrinio.com/developer-sandbox/coverage/us-fundamentals-financials-metrics-ratios-stock-prices"}>Available assets?</a>
                        <form onSubmit={this.submitForm}>
                        <h4 id="title">Add New Assets</h4>
                            <label htmlFor="ticker"/>
                            <p className="PortfolioForm-text">Ticker</p>
                            <input 
                            className="Portfolio-form-ticker-input"
                            type="text"
                            name="ticker"
                            value={this.state.ticker}
                            onChange={this.onValueChange}
                            />
                            <p className="PortfolioForm-text">Quantity</p> 
                            <label htmlFor="quantity"/>
                            <input 
                            className="Portfolio-form-quantity-input"
                            type="number"
                            name="quantity"
                            min={1}
                            max={1000000000}
                            value={this.state.quantity}
                            onChange={this.onValueChange}
                            />
                            <p className="PortfolioForm-text">Aquisition Cost</p>  
                            <label htmlFor="priceBoughtAt"/>
                            <input 
                            className="Portfolio-form-priceBoughtAt-input"
                            type="number"
                            name="priceBoughtAt"
                            min={0}
                            max={1000000000}
                            value={this.state.priceBoughtAt}
                            onChange={this.onValueChange}
                            />
                            <button className="Portfolio-form-submit">Add</button>
                        </form>
                        
                        
               
            </div>
            )
        }

}

export default PortfolioForm;