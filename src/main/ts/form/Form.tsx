import React from "react";
import {User} from "../db/models/User";
import {throws} from "assert";

export interface FormPropsInterface {

}

export interface FormStateInterface {
    data: Array<User> | null
}

export default class Form extends React.Component<FormPropsInterface, FormStateInterface> {
    constructor(props: FormStateInterface) {
        super(props);
        this.state = {
            data: null
        }
    }

    getData = (): void => {
        fetch("/api/data")
            .then((res) => {
                res.json()
                    .then((data: Array<User>) => {
                        this.setState({
                            data: data
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

    render() {
        return (
            <div>
                DATABASE CONTAINS
                <ol>
                    {this.state.data &&
                    this.state.data.map((user: User) => {
                        return (
                            <li>{user.username} : {user.password}</li>
                        )
                    })
                    }
                </ol>
                <button onClick={this.getData}>Take records</button>
            </div>
        )
    }
}

