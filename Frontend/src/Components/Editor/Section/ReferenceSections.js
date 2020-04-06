// import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Paper,  IconButton  } from '@material-ui/core';
import { Delete, DragIndicator  } from '@material-ui/icons';
import { SortableHandle } from 'react-sortable-hoc';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ReferenceActionTypes } from '../../../Store/Store';

import MenuIcon from '@material-ui/icons/Menu';
const DragHandle = SortableHandle(() => (
    <MenuIcon  style={{ cursor: 'move', paddingLeft: '8px', paddingRight: '8px' }} />
));

class CodeSection extends Component {
    state = {
        id: this.props.uid,
        text: this.props.text,
        type: this.props.type
    };

    handleInputChange = event => {
        const newState = { ...this.state };
        newState[event.target.name] = event.target.value;
        this.setState(newState);

        this.props.dispatch({
            type: ReferenceActionTypes.UPDATE_ITEM,
            payload: newState
        });

        // var a = 10;
        // setState({ ...state, [event.target.name]: event.target.value });
    };

    render() {
        return (
            <Paper style={{ marginBottom: '24px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px'
                    }}
                >
                    <DragHandle
                    // style={{ marginLeft: '8px', marginRight: '8px' }}
                    />
             
                    <div style={{ flex: 1 }} />
                    <IconButton
                        onClick={() => {
                            this.props.dispatch({
                                type: ReferenceActionTypes.DELETE_ITEM,
                                payload: { id: this.state.id }
                            });

                            // console.log(this.props.onUpdate);
                            setTimeout(() => this.props.onUpdate(), 200);
                        }}
                    >
                        <Delete color="error" />
                    </IconButton>
                </div>
                <TextField
                    name="text"
                    label="Enter reference"
                    multiline
                    style={{ margin: 0 }}
                    rowsMax="5"
                    fullWidth
                    value={this.state.text}
                    onChange={this.handleInputChange}
                    // className={classes.textField}
                    margin="normal"
                    variant="filled"
                />
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        items: state.referenceSections
    };
};
const mapDispatchToProps = dispatch => {
    return {
        dispatch
        // swapItems: ()=>dispatch({type: ReferenceActionTypes,})
    };
};
export default connect(mapStateToProps)(CodeSection);
