import React, { Component } from "react";
import RepLogs from "./RepLogs";
import PropTypes from "prop-types";
import { v4 as uuid } from 'uuid';
import { getRepLogs, deleteRepLog, createRepLog } from "../api/rep_log_api";

export default class RepLogApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfHearts: 1,
            highlightedRowId: null,
            repLogs: [],
            isLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleAddRepLog = this.handleAddRepLog.bind(this);
        this.handleHeartChange = this.handleHeartChange.bind(this);
        this.handleDeleteRepLog = this.handleDeleteRepLog.bind(this);
    }

    componentDidMount() {
        getRepLogs()
            .then((data) => {
                this.setState({
                    repLogs: data,
                    isLoaded: true
                });
            });
    }

    handleClick(repLogId) {
        this.setState({ highlightedRowId: repLogId })
    }

    handleAddRepLog(item, reps) {
        const newRep = {
            reps: reps,
            item: item,
        };
        createRepLog(newRep)
            .then(repLog => {
                this.setState(prevState => {
                    const newRepLog = [ ...prevState.repLogs, repLog ];
                    return { repLogs: newRepLog };
                })
            });
    }

    handleHeartChange(heartCount) {
        this.setState({
            numberOfHearts: heartCount
        });
    }

    handleDeleteRepLog(id) {
        deleteRepLog(id);
        this.setState(prevState => {
            return {
                repLogs: prevState.repLogs.filter(repLog => repLog.id !== id)
            }
        })
    }

    render() {
        return <RepLogs
            { ...this.props }
            { ...this.state }
            onRowClick={ this.handleClick }
            repLogs={ this.state.repLogs }
            onAddRepLog={ this.handleAddRepLog }
            onHeartChange={ this.handleHeartChange }
            onDeleteRepLog={ this.handleDeleteRepLog }
        />
    }
}

RepLogApp.propTypes = {
    withHeart: PropTypes.bool
}