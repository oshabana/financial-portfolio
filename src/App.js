import React, { Component } from "react";
import PortfolioPage from "./PortfolioPage";
import Login from "./Login";
import Signup from "./Signup";
import "./styles/App.css";
import axios from "axios";
import Cookies from "js-cookie";
import { Switch, Route, Redirect } from "react-router-dom";
//require('dotenv').config() would need but i have create-react-app

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            loggedIn: false,
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.playground = this.playground.bind(this);
    }
    async componentDidMount() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_URL}/portfolio`
            );
            console.log(response.data);
            this.setState({ loggedIn: true, user: response.data });
        } catch (err) {
            console.log("Not logined in");
        }
    }

    async login(cookieData) {
        Cookies.set("token", cookieData.token, { expires: 7 });
        Cookies.set("id", cookieData.id, { expires: 7 });

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_URL}/portfolio`
            );
            if (response.status < 400) {
                this.setState({ user: response.data, loggedIn: true });
            }
        } catch (err) {
            console.log("Error getting your profile");
        }
    }
    //console.log(response)

    logout() {
        this.setState({ loggedIn: false });
        Cookies.remove("token");
        Cookies.remove("id");
        window.location.reload();
    }

    playground() {
        alert(
            "This is playground mode, any changes you make won't be saved. Make an account if you'd like this app to remember your assets."
        );
        this.setState({ loggedIn: true });
    }

    render() {
        /*
      <div id="wrapper">
        {(this.state.loggedIn && this.state.user !== {}) ? <PortfolioPage logout={this.logout} user={this.state.user}/> : <Login login={this.login}/>}  
        {!this.state.loggedIn ? <button onClick={this.playground}>Test the app</button> : ""}
      </div>
*/
        return (
            <div id="wrapper">
                {this.state.loggedIn && this.state.user !== {} ? (
                    <Redirect to="/portfolio" />
                ) : (
                    <Redirect to="/" />
                )}
                {!this.state.loggedIn ? (
                    <button onClick={this.playground}>Test the app</button>
                ) : (
                    ""
                )}

                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => <Login login={this.login} />}
                    />
                    <Route
                        exact
                        path="/portfolio"
                        render={() => (
                            <PortfolioPage
                                logout={this.logout}
                                user={this.state.user}
                            />
                        )}
                    />
                    <Route exact path="/signup" render={() => <Signup />} />
                </Switch>
            </div>
        );
    }
}

export default App;
