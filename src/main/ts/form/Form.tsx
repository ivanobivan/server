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

    getData = async () => {
        const res = await fetch("/api/data");
        const data: Array<User> = await res.json();
        this.setState({
            data: data,
            responseText: ""
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


    addUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await fetch("/api/create", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(new User(
                    this.state.username,
                    this.state.password
                ))
            }
        );
        this.setState({
            responseText: res.statusText
        })
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
            </div>
        )
    }
}

