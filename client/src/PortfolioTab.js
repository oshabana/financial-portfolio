import React, { Component } from 'react'
import './styles/PortfolioTab.css'
import commaNumber from 'comma-number'

class PortfolioTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            ticker: '',
            quantity : 0,
            priceBoughtAt: 0,
            price: 0,
            value: 0,
            editMode: false
        };
        this.processEdit = this.processEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.processDelete = this.processDelete.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        let value = this.props.price * this.props.quantity
        let price = (this.props.price) // only way to apply toFixed and commaNumber
        let priceBoughtAt = this.props.priceBoughtAt
       
        this.setState({
            id: this.props.id,
            ticker:this.props.ticker, 
            quantity: this.props.quantity, 
            priceBoughtAt: priceBoughtAt,
            price: price,
            value: value,
        })
        
    }
   
    processEdit(){
        this.setState({editMode: !this.state.editMode})
      
    }

    processDelete(){
        this.props.handleDelete(this.props.id)
        
    }
    submit(e){
        e.preventDefault()
        let value = this.state.quantity * this.state.price
        this.setState({editMode: !this.state.editMode, value: value})
        this.props.handleEdit(this.state.ticker, this.state.quantity, this.state.priceBoughtAt)
    
    }
    cancel(){
        this.setState({editMode: !this.state.editMode})
        let value = this.props.price * this.props.quantity
        let price = (this.props.price) // only way to apply toFixed and commaNumber
        let priceBoughtAt = this.props.priceBoughtAt
       
        this.setState({
            ticker:this.props.ticker, 
            quantity: this.props.quantity, 
            priceBoughtAt: priceBoughtAt,
            price: price,
            value: value,
        })
    }
   
    handleChange(e){
        e.preventDefault()
        this.setState({[e.target.name]: e.target.value})
        
    }

    render() {
        let editBox = 
        <div>
            <form onSubmit={this.submit}>
                <input 
                name="quantity"
                className="PortfolioTab-editBox"
                type="number"
                max={100000000}
                min={1}
                value={this.state.quantity}
                onChange={this.handleChange}
                />
                <input 
                name="priceBoughtAt"
                className="PortfolioTab-editBox"
                type="number"
                max={100000000}
                min={0}
                value={this.state.priceBoughtAt}
                onChange={this.handleChange}
                />
                <button className="PortfolioTab-submit PortfolioTab-btns" type="submit">Save</button>
                <button className="PortfolioTab-cancel PortfolioTab-btns" onClick={this.cancel}>Cancel</button>
            </form>
            
        </div>
        
        let buttons = 
        <div className="PortfolioTab-btns">
            <button className="PortfolioTab-edit" onClick={this.processEdit}><i className="fa fa-bars"></i></button>
            <button className="PortfolioTab-delete" onClick={this.processDelete}><i className="fa fa-trash"></i></button>
        </div>
        
        let price, priceBoughtAt, value, posOrNeg;
        price = this.state.price
        priceBoughtAt = this.state.priceBoughtAt
        value = this.state.value
        
        price = price.toFixed(2)
        value = value.toFixed(2)
        
        price = commaNumber(price)
        value = commaNumber(value)
        priceBoughtAt = commaNumber(priceBoughtAt)
        
        posOrNeg = (this.state.price - this.state.priceBoughtAt) * this.state.quantity
        posOrNeg = posOrNeg.toFixed(2)
      
       
        return(

                <div className="Portfolio-tab">
                    <p>{this.state.ticker}</p>
                    {this.state.editMode ? editBox: <p>Quantity: {this.state.quantity}</p>}
                    <p>Current Price: {`$${price}`}</p>
                    <p>Aquisition Cost: {`$${priceBoughtAt}`}</p>
                    <p>Total Value: {`$${value}`}</p>
                    <p className={(posOrNeg < 0 ? "red" : "green")}>+/- {`$${commaNumber(Math.abs(posOrNeg))}`}</p>
                    {this.state.editMode ? "" : buttons}
                </div>
        )
    }
}

export default PortfolioTab;