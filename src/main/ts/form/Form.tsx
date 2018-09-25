import React from "react";
import axios, {AxiosResponse} from "axios";
import {User} from "./instances/User";

export interface FormPropsInterface {

}

export interface FormStateInterface {
    data: Array<User> | null
    username: string;
    password: string;
    responseText: string;
}

export default class Form extends React.Component<FormPropsInterface, FormStateInterface> {
    constructor(props: FormStateInterface) {
        super(props);
        this.state = {
            data: null,
            username: "",
            password: "",
            responseText: ""
        }
    }

    getData = (): void => {
        fetch("/api/data")
            .then((res) => {
                res.json()
                    .then((data: Array<User>) => {
                        this.setState({
                            data: data,
                            responseText: ""
                        })
                    })
                    .catch(reason => {
                        throw reason
                    })
            })
            .catch((err: Error) => {
                throw err;
            })
    };

    onChangeUsername = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            username: event.currentTarget.value
        });
    };

    onChangePassword = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: event.currentTarget.value
        });
    };

    addUser = (event: React.FormEvent<HTMLFormElement>) => {
        const user = new User(
            this.state.username,
            this.state.password
        );
        axios.post("/api/create", user)
            .then((res: AxiosResponse) => {
                this.setState({
                    responseText: res.statusText
                })
            })
            .catch((err: Error) => {
                this.setState({
                    responseText: err.message
                });
                throw err;
            });
        event.preventDefault();
    };

    render() {
        return (
            <div>
                DATABASE CONTAINS
                <ol>
                    {this.state.data &&
                    this.state.data.map((user: User, index: number) => {
                        return (
                            <li key={index}>{user.username} : {user.password}</li>
                        )
                    })
                    }
                </ol>
                <button onClick={this.getData}>Take records</button>
                <fieldset>
                    <legend>Add User</legend>
                    <form onSubmit={this.addUser}>
                        <label htmlFor="username">User name</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                        <button type="submit">Send</button>
                        <span>{this.state.responseText}</span>
                    </form>
                </fieldset>
                <button onClick={this.getData}>Add record</button>
            </div>
        )
    }
}

