// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SignUpLoginCanvas from "./signup-login-canvas";
import { IUserContext } from '../App';
import { basePostRequest } from "./../../util/base-requests";

export interface ISignupLoginProviderState {
    username: string;
    password: string;
    signUpFirstName: string;
    signUpUsername: string;
    signUpPass1: string;
    signUpPass2: string;
    signupErrorMessage: string;
    loginErrorMessage: string;
}

class SignupLoginProviderClass extends React.Component<RouteComponentProps<{}>, ISignupLoginProviderState> {
    private _userData: IUserContext;

    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            username: "",
            password: "",
            signUpFirstName: "",
            signUpUsername: "",
            signUpPass1: "",
            signUpPass2: "",
            signupErrorMessage: "",
            loginErrorMessage: ""
        };
    }

    isSignUpButtonEnabled = () => {
        return this.state.signUpFirstName.length > 0
        && this.state.signUpUsername.length > 0
        && this.state.signUpPass1.length > 0
        && this.state.signUpPass1 == this.state.signUpPass2;
    }

    isLoginButtonEnabled = () => {
        return this.state.username.length > 0
        && this.state.password.length > 0;
    }

    submitSignupResponseHandler = (data: any) => {
        this.setState({ loginErrorMessage: "" });
        console.log(data);
    }

    submitSignupErrorHandler = (error: any) => {
        this.setState({ loginErrorMessage: "Sign up failure" });
        console.log(error);
    }

    submitSignup = () => {
        const postRequestData = {
            username: this.state.signUpUsername,
            pass: this.state.signUpPass1,
            displayName: this.state.signUpFirstName
        };
        basePostRequest("signup", postRequestData, this.submitSignupResponseHandler, this.submitSignupErrorHandler);
    }

    submitLoginResponseHandler = (data: any) => {
        if (data && data.statusMessage == 1) {
            const username = this.state.username;
            console.log("Log in success for user " + username);
            const userInfo = {
                userId: 0,
                username
            };
            this._userData.updateUser(userInfo);
            localStorage.setItem('userId', userInfo.userId.toString());
            localStorage.setItem('username', userInfo.username.toString());
            
            this.props.history.push("/");
            this.setState({ loginErrorMessage: "" });
        }
        else {
            this.setState({ loginErrorMessage: "Log in failure" });
            console.log("Log in failure")
        }
    }

    submitLoginErrorHandler = (error: any) => {
        console.log(error);
    }
    
    submitLogin = (userData: IUserContext) => {
        this._userData = userData;
        const postRequestData = {
            username: this.state.username,
            pass: this.state.password
        };
        basePostRequest("login", postRequestData, this.submitLoginResponseHandler, this.submitLoginErrorHandler);
    }

    updateInputValues = (inputType: string, value: string) => {
        switch (inputType) {
            case "signUpFirstName":
                this.setState({ signUpFirstName: value });
                break;
            case "signUpUsername":
                this.setState({ signUpUsername: value });
                break;
            case "signUpPass1":
                this.setState({ signUpPass1: value });
                break;
            case "signUpPass2":
                this.setState({ signUpPass2: value });
                break;
            case "username":
                this.setState({ username: value });
                break;
            case "password":
                this.setState({ password: value });
                break;
            default:
                break;
        }
    }

    /**
     * Renders sign-up/login form component
     * @return  {React.Component}   Rendered component
     */
    render = () => {
        return (
            <SignUpLoginCanvas
                username={this.state.username}
                password={this.state.password}
                signUpFirstName={this.state.signUpFirstName}
                signUpUsername={this.state.signUpUsername}
                signUpPass1={this.state.signUpPass1}
                signUpPass2={this.state.signUpPass2}
                isSignUpButtonEnabled={this.isSignUpButtonEnabled}
                isLoginButtonEnabled={this.isLoginButtonEnabled}
                submitSignup={this.submitSignup}
                submitLogin={this.submitLogin}
                updateInputValues={this.updateInputValues}
                signupErrorMessage={this.state.signupErrorMessage}
                loginErrorMessage={this.state.loginErrorMessage}
            />
        );
    }
}

export const SignupLogin = withRouter(SignupLoginProviderClass);