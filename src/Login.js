import React, { Component } from "react";
import "./styles/Login.css";
import { Switch, Link, Route } from "react-router-dom";
import PortfolioPage from "./PortfolioPage";
import Signup from "./Signup";
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isInvalid: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e) {
        e.preventDefault();
        const userInfo = {
            email: this.state.email,
            password: this.state.password,
        };

        const response = await axios.post(
            `${process.env.REACT_APP_URL}/login`,
            { params: userInfo }
        );
        if (response.data !== "") {
            this.props.login(response.data);
        } else this.setState({ isInvalid: true });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="Login">
                <h3 className="Login-title">Portfolio</h3>
                {this.state.isInvalid ? (
                    <p className="red"> Invalid login </p>
                ) : (
                    ""
                )}
                <form className="Login-form" onSubmit={this.handleSubmit}>
                    <label className="Login-label" htmlFor="email" />
                    <input
                        className="Login-input"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                    <label className="Login-label" htmlFor="password" />
                    <input
                        className="Login-input"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                    <button className="Login-button">Login</button>
                    <Link exact to="/signup">
                        {" "}
                        Sign Up{" "}
                    </Link>
                </form>
                <Switch>
                    <Route exact path="/signup" render={() => <Signup />} />
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
                </Switch>
            </div>
        );
    }
}

export default Login;
