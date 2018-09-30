import React from "react";
import {User} from "../db/instances/User";

export interface FormPropsInterface {

}

export interface FormStateInterface {
    data: Array<User> | null;
    current: User | null;
    username: string;
    password: string;
    uuid: string;
    responseText: string;
    logInUsername: string;
    logInPassword: string;
}

export default class Form extends React.Component<FormPropsInterface, FormStateInterface> {
    constructor(props: FormStateInterface) {
        super(props);
        this.state = {
            data: null,
            current: null,
            username: "",
            password: "",
            uuid: "",
            responseText: "",
            logInUsername: "",
            logInPassword: ""
        }
    }

    getData = async (): Promise<void> => {
        try {
            const res = await fetch("/api/getAll");
            const data: Array<User> = await res.json();
            this.setState({
                data: data,
                responseText: ""
            })
        } catch (e) {
            throw e;
        }

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

    onChangeUuid = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            uuid: event.currentTarget.value
        });
    };

    onChangeLogInUsername = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            logInUsername: event.currentTarget.value
        });
    };

    onChangeLogInPassword = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            logInPassword: event.currentTarget.value
        });
    };
    addUser = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
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
        } catch (e) {
            //todo Error handler component
            throw e;
        }

    };

    getUser = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            const res = await fetch("/api/delete", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        uuid: this.state.uuid.trim()
                    })
                }
            );
            const user: User = await res.json();
            this.setState({
                current: user
            })
        } catch (e) {
            throw e;
        }
    };

    signUpUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await fetch("/auth/signUp", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                method: "POST",
                body: JSON.stringify(new User(
                    this.state.logInUsername,
                    this.state.logInPassword
                ))
            });
            const data = await res.json();
            console.log(data);
        } catch (e) {
            throw e;
        }
    };

    logInUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await fetch("/auth/logIn", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                method: "POST",
                body: JSON.stringify(new User(
                    this.state.logInUsername,
                    this.state.logInPassword
                ))
            });
            const data = await res.json();
            console.log(data);
        } catch (e) {
            throw e;
        }
    };

    logOut = async (event: React.MouseEvent) => {
        try {
            const res = await fetch("auth/logOut");
            const data = await res.json();
            console.log(data);
        } catch (e) {
            throw e;
        }
    };

    render() {
        return (
            <div>
                DATABASE CONTAINS
                <ol>
                    {this.state.data &&
                    this.state.data.map((user: User, index: number) => {
                        return (
                            <li key={index}>{user.username} : {user.password} : {user.uuid}</li>
                        )
                    })
                    }
                </ol>
                CURRENT
                {this.state.current &&
                <ul>
                    <li>NAME: {this.state.current.username}</li>
                    <li>PASSWORD: {this.state.current.password}</li>
                    <li>UUID: {this.state.current.uuid}</li>
                </ul>
                }
                <button onClick={this.getData}>Take records</button>
                <fieldset>
                    <legend>Create User</legend>
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
                        <button type="submit">Create</button>
                        <span>{this.state.responseText}</span>
                    </form>
                </fieldset>

                <fieldset>
                    <legend>Get/Delete User</legend>
                    <form onSubmit={this.getUser}>
                        <label htmlFor="uuid">UUID</label>
                        <input
                            type="text"
                            name="uuid"
                            id="uuid"
                            value={this.state.uuid}
                            onChange={this.onChangeUuid}
                        />
                        <button type="submit">Get</button>
                        <button type="submit">Delete</button>
                    </form>
                </fieldset>

                <fieldset>
                    <legend>Log In User</legend>
                    <form onSubmit={this.logInUser}>
                        <label htmlFor="usernameLogIn">User name</label>
                        <input
                            type="text"
                            name="username"
                            id="usernameLogIn"
                            value={this.state.logInUsername}
                            onChange={this.onChangeLogInUsername}
                        />
                        <label htmlFor="passwordLogIn">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="passwordLogIn"
                            value={this.state.logInPassword}
                            onChange={this.onChangeLogInPassword}
                        />
                        <button type="submit">Log In</button>
                    </form>
                </fieldset>
                <fieldset>
                    <legend>Log In User</legend>
                    <form onSubmit={this.signUpUser}>
                        <button type="submit">Sign Up</button>
                    </form>
                </fieldset>
                <fieldset>
                    <legend>Log Out</legend>
                    <button onClick={this.logOut}>Log Out</button>
                </fieldset>
            </div>
        )
    }
}

