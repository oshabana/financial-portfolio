import React, { Component } from 'react'
import "./styles/PortfolioValueTab.css"
import commaNumber from 'comma-number'

class PortfolioValueTab extends Component{

    render(){
        let totalValue = this.props.totalValue
        let gainOrLoss = this.props.gainOrLoss
        gainOrLoss = (gainOrLoss).toFixed(2)
        totalValue = totalValue.toFixed(2)
        totalValue = commaNumber(totalValue)
        return(
            <div className="PortfolioValueTab">
                <p >Portfolio Value: ${totalValue}</p>
                <p className={(this.props.gainOrLoss < 0 
                    ? "red" :
                     "green")}>Overall +/- {`$${commaNumber(Math.abs(gainOrLoss))}`} </p>
            </div>
        )
    }
}

export default PortfolioValueTab