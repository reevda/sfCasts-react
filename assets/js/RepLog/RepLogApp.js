import React, { Component } from "react";
import RepLogs from "./RepLogs";
import PropTypes from "prop-types";
import { v4 as uuid } from 'uuid';


export default class RepLogApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfHearts: 1,
            highlightedRowId: null,
            repLogs: [
                { id: uuid(), reps: 25, itemLabel: 'My laptop', totalWeightLifted: 112.5 },
                { id: uuid(), reps: 10, itemLabel: 'Big Fat Cat', totalWeightLifted: 180 },
                { id: uuid(), reps: 4, itemLabel: 'Big Fat Cat', totalWeightLifted: 72 }
            ]
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleAddRepLog = this.handleAddRepLog.bind(this);
        this.handleHeartChange = this.handleHeartChange.bind(this);
    }

    handleClick(repLogId) {
        this.setState({ highlightedRowId: repLogId })
    }

    handleAddRepLog(itemLabel, reps) {
        const newRep = {
            id: uuid(),
            reps: reps,
            itemLabel: itemLabel,
            totalWeightLifted: Math.floor(Math.random() * 50)
        };
        this.setState(prevState => {
            return { repLogs: [ ...prevState.repLogs, newRep ] };
        });
    }

    handleHeartChange(heartCount) {
        this.setState({
            numberOfHearts: heartCount
        });
    }

    render() {
        return <RepLogs
            { ...this.props }
            { ...this.state }
            onRowClick={ this.handleClick }
            repLogs={ this.state.repLogs }
            onAddRepLog={ this.handleAddRepLog }
            onHeartChange={this.handleHeartChange}
        />
    }
}

RepLogApp.propTypes = {
    withHeart: PropTypes.bool
}