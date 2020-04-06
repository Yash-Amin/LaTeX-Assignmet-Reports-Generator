import React, { Component } from 'react';
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';
import { Fab, Button, Container } from '@material-ui/core';
import {
    Link as LinkIcon
} from '@material-ui/icons';
import axios from '../../axiosInstance'
import { connect } from 'react-redux';
import { ReferenceActionTypes } from '../../Store/Store';

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

import ReferenceSection from '../Editor/Section/ReferenceSections';
import { Grid } from '@material-ui/core';

const SortableItem = SortableElement(({ value, onUpdate }) => {
    return (
        <ReferenceSection
            key={value.id}
            onUpdate={onUpdate}
            uid={value.id}
            text={value.text}
            type={value.type}
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

export class Reference extends Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex) {
            this.props.dispatch({
                type: ReferenceActionTypes.SWAP_SECTION_ITEMS,
                payload: {
                    newIndex,
                    oldIndex
                }
            });
        }
        // this.setState(({ items }) => ({
        //     items: arrayMove(items, oldIndex, newIndex)
        // }));
    };

    onItemClick = () => {
        // console.log('Item Clicked!');
    };

    // shouldComponentUpdate(newState, newProps) {
    //     console.log('[SHOULD UPDATE] ', newState, this.state);
    //     return newState != this.state;
    // }
    onItemDeleteHandler = () => {
        this.forceUpdate();
    };

    newTextClick = () => {
        this.props.dispatch({ type: ReferenceActionTypes.NEW_TEXT });
        this.onItemDeleteHandler();
    };

    newImageClick = () => {
        this.onItemDeleteHandler();
    };
    UploadClick = e => {
        e.preventDefault();
        this.props.dispatch({ type: ReferenceActionTypes.UPLOAD });
        axios
            .post(
                '/api/practicals/' +
                    this.props.practicalID +
                    '/reference',
                this.props.items,
                { withCredentials: true }
            )
            .then(data => {
                this.props.dispatch({ type: ReferenceActionTypes.UPLOADED });
            })
            .catch(err => {
                //TODO: Error
                alert('Error');
                // props.dispatch({ type: InformationActionTypes.UPLOAD });
            });
    };
    render() {
        // const classes = this.useStyles();
        return (
            <Container>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%'
                        }}
                    >
                        <h2 style={{ flex: 1 }}>References</h2>
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
                                <LinkIcon
                                    spacing={1}
                                    style={{ marginRight: '8px' }}
                                />
                                New Reference
                            </Fab>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    var referenceState = state.ReferenceReducer;
    // alert()
    return {
        ...state.PracticalReducer,
        items: referenceState.referenceSections,
        uploaded: referenceState.uploaded
    };
};
const mapDispatchToProps = dispatch => {
    return {
        dispatch
        // swapItems: ()=>dispatch({type: ReferenceActionTypes,})
    };
};
export default connect(mapStateToProps)(Reference);
