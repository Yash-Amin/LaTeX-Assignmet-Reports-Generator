import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Fab, Button, Container } from '@material-ui/core';
import axios from '../../axiosInstance'
import { Code as CodeIcon } from '@material-ui/icons';
import { connect } from 'react-redux';
import { CodeActionTypes } from '../../Store/Store';

// const SortableItem = SortableElement(({ value }) => {
//     return (
//         <div style={{ border: '1px solid black', padding: '10px' }}>
//             <div>
//                 {value}
//                 <button
//                     style={{ float: 'right' }}
//                     onClick={() => {
//                         console.log(value);
//                     }}
//                 >
//                     Delete
//                 </button>
//             </div>
//             <textarea rows={5} />
//         </div>
//     );
// });

import CodeSection from '../Editor/Section/CodeSections';
import { Grid } from '@material-ui/core';

const SortableItem = SortableElement(({ value, onUpdate }) => {
    return (
        <CodeSection
            key={value.id}
            onUpdate={onUpdate}
            uid={value.id}
            text={value.text}
            type={value.type}
            fileName={value.fileName}
        />
    );
});

const SortableList = SortableContainer(({ items, onUpdate }) => {
    // console.log(SortableItem);
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    onUpdate={onUpdate}
                    value={value}
                />
            ))}
        </ul>
    );
});

export class Code extends Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex) {
            this.props.dispatch({
                type: CodeActionTypes.SWAP_SECTION_ITEMS,
                payload: {
                    newIndex,
                    oldIndex
                }
            });
        }
    };

    onItemClick = () => {
        console.log('Item Clicked!');
    };
    UploadClick = e => {
        e.preventDefault();
        this.props.dispatch({ type: CodeActionTypes.UPLOAD });
        axios
            .post(
                '/api/practicals/' +
                    this.props.practicalID +
                    '/code',
                this.props.items,
                { withCredentials: true }
            )
            .then(data => {
                this.props.dispatch({ type: CodeActionTypes.UPLOADED });
            })
            .catch(err => {
                //TODO: Error
                alert('Error');
                // props.dispatch({ type: InformationActionTypes.UPLOAD });
            });
    };
    // shouldComponentUpdate(newState, newProps) {
    //     console.log('[SHOULD UPDATE] ', newState, this.state);
    //     return newState != this.state;
    // }
    onItemDeleteHandler = () => {
        this.forceUpdate();
    };

    newTextClick = () => {
        this.props.dispatch({ type: CodeActionTypes.NEW_TEXT });
        this.onItemDeleteHandler();
    };
    newImageClick = () => {
        this.onItemDeleteHandler();
    };

    render() {
        // const classes = this.useStyles();

        return (
            <Container>
                {' '}
                <Grid spacing={1}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <h2 style={{ flex: 1 }}>Code</h2>
                        <Button
                            color={
                                this.props.uploaded ? 'primary' : 'secondary'
                            }
                            style={{ height: 'fit-content' }}
                            variant="contained"
                            onClick={this.UploadClick}
                        >
                            {this.props.uploaded ? 'Saved' : 'Not Saved'}
                        </Button>
                    </div>
                    <SortableList
                        useDragHandle
                        items={this.props.items}
                        onUpdate={this.onItemDeleteHandler}
                        onSortEnd={this.onSortEnd}
                    />
                    <Grid container spacing={1} justify="center">
                        <Grid item>
                            <Fab
                                variant="extended"
                                color="primary"
                                aria-label="add"
                                onClick={this.newTextClick}
                            >
                                <CodeIcon
                                    spacing={1}
                                    style={{ marginRight: '8px' }}
                                />
                                New File
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    var codeState = state.CodeReducer;
    return {
        ...state.PracticalReducer,
        items: codeState.codeSections,
        uploaded: codeState.uploaded
    };
};
const mapDispatchToProps = dispatch => {
    return {
        dispatch
        // swapItems: ()=>dispatch({type: CodeActionTypes,})
    };
};
export default connect(mapStateToProps)(Code);
