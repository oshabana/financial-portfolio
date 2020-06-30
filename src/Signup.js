import React, { Component} from 'react';
import "./styles/Signup.css"
import axios from 'axios'
import {Redirect, Router, Route} from 'react-router-dom'
import Login from "./Login"

class Signup extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             email: "testfolio@test.com",
             password1: "test123",
             password2: "test123",
             emailError: false,
             passwordError: false,
             signupError: false,
             signupCompleted: false
        }
        this.signup = this.signup.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    async signup(e){
        e.preventDefault()
        if (this.state.password1 !== this.state.password2){
            this.setState({passwordError: true})
        }
        const userInfo = {
            email: this.state.email,
            password: this.state.password1, 
            portfolio: {}, 
            tokens:{}
        }
        try{
            const response = await axios.post(`${process.env.REACT_APP_URL}/signup`, {params: userInfo},{withCredentials: true})
            if(response.data.err) this.setState({emailError: true})
            this.setState({signupCompleted: true})
            return <Redirect to="/login"></Redirect>
        }
        catch (err) {
            this.setState({signupError: true})
        }
    }

    handleChange (e){
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        return (
            <div className="Signup">
                <h3 className="Signup-title">Sign up</h3>

                {(this.state.passwordError ? <p className="error">Password don't match</p>: "")}
                {(this.state.emailError ? <p className="error">An account with email already exists</p>: "")}
                {(this.state.signupError ? <p className="error">Something went wrong</p>: "")}
                {(this.state.signupCompleted && !this.state.signupError ? <p className="success">Thank you for signing up! </p> : "")}

                <form className="Signup-form" onSubmit={this.signup}>
                    <label className="Signup-label" htmlFor="email"/>
                    <input
                    className="Signup-input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    />
                    <label className="Signup-label" htmlFor="password"/>
                    <input
                    className="Signup-input"
                    name="password1"
                    type="password"
                    placeholder="Password"
                    value={this.state.password1}
                    onChange={this.handleChange}
                    />
                    <label className="Signup-label" htmlFor="password"/>
                    <input
                    className="Signup-input"
                    name="password2"
                    type="password"
                    placeholder="Retype your Password"
                    value={this.state.password2}
                    onChange={this.handleChange}
                    />
                    <button className="Signup-button">Sign up</button>
            
                </form>
               
            </div>
        )
    }

}

export default Signup