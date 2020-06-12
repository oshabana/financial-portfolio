import React, { Component } from 'react'
import Portfolio from "./Portfolio"
import './styles/PortfolioPage.css'



class PortfolioPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            profile: {portfolioList: {}, assetPrices: {}},
            isLoaded: false
        }
        this.sendInfo = this.sendInfo.bind(this)
     

    }

    async componentDidMount(){
        this.setState({
            profile: {portfolioList: this.props.user.portfolio,
                assetPrices: this.props.user.assetPrices
        }, isLoaded: true})
      
    }

    async sendInfo(e){
        e.preventDefault()
        alert(e.target.value)
    }
    render(){
        let display;
        (this.state.isLoaded ? display = <div className="PortfolioPagebackground-color: grey;-profile">
            <Portfolio userName={this.props.user.email} profile={this.state.profile} logout={this.props.logout}/>
            </div>
            :
            display = <div> Loading... </div>)

        return (
            display
        )
    };
}

export default PortfolioPage;