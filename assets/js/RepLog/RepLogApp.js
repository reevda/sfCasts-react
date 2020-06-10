import React, { Component } from "react";
import RepLogs from "./RepLogs";
import PropTypes from "prop-types";


export default class RepLogApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlightedRowId: null,
            repLogs: [
                { id: 1, reps: 25, itemLabel: 'My laptop', totalWeightLifted: 112.5 },
                { id: 2, reps: 10, itemLabel: 'Big Fat Cat', totalWeightLifted: 180 },
                { id: 8, reps: 4, itemLabel: 'Big Fat Cat', totalWeightLifted: 72 }
            ]
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(repLogId, event) {
        this.setState({ highlightedRowId: repLogId })
    }

    render() {
        const { highlightedRowId } = this.state;
        const { withHeart } = this.props;

        return <RepLogs
            { ...this.props }
            { ...this.state }
            onRowClick={ this.handleClick }
            repLogs={ this.state.repLogs }
        />

    }
}

RepLogApp.propTypes = {
    withHeart: PropTypes.bool
}