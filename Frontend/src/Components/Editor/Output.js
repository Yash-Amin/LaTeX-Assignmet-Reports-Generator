import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Fab, Button, Container } from '@material-ui/core';
import { AddPhotoAlternate } from '@material-ui/icons';
import axios from '../../axiosInstance'
import { connect } from 'react-redux';
import { OutputActionTypes } from '../../Store/Store';

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

import { Grid } from '@material-ui/core';
import OpImageSection from './Section/OutputImageSection';

const SortableItem = SortableElement(
    ({ value, onUpdate, onImageUpdate, onDeleteItem }) => {
        return (
            <OpImageSection
                key={value.id}
                onDeleteItem={onDeleteItem}
                uid={value.uid}
                action={OutputActionTypes.UPDATE_ITEM}
                onUpdate={onUpdate}
                {...value}
                onImageUpdate={onImageUpdate}
            />
        );
    }
);

const SortableList = SortableContainer(
    ({ items, onImageUpdate, onUpdate, onDeleteItem }) => {
        // console.log(SortableItem);
        // console.log(items);
        // alert('Sortable List: ' + JSON.stringify(items  ))
        return (
            <ul>
                {items.map((value, index) => (

                    <SortableItem
                        key={`item-${value.id}`}
                        index={index}
                        onDeleteItem={onDeleteItem}
                        onImageUpdate={onImageUpdate}
                        onUpdate={onUpdate}
                        value={value}
                    />
                ))}
            </ul>
        );
    }
);

export class Output extends Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex) {
            this.props.dispatch({
                type: OutputActionTypes.SWAP_SECTION_ITEMS,
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
        console.log('Item Clicked!');
    };

    // shouldComponentUpdate(newState, newProps) {
    //     console.log('[SHOULD UPDATE] ', newState, this.state);
    //     return newState != this.state;
    // }
    onItemDeleteHandler = () => {
        this.forceUpdate();
    };
    onDeleteItem = img => {
        this.props.dispatch({
            type: OutputActionTypes.DELETE_ITEM,
            payload: { id: img.id }
        });

        // alert(JSON.stringify(img));
    };
    newImageClick = () => {
        this.props.dispatch({ type: OutputActionTypes.NEW_IMAGE });
        this.onItemDeleteHandler();
    };

    onImageUpdate = img => {
        // alert(
        //     'OP ' + OutputActionTypes.UPDATE_ITEM + ' ' + JSON.stringify(img)
        // );

        this.props.dispatch({
            type: OutputActionTypes.UPDATE_ITEM,
            payload: img
        });
    };

    UploadClick = e => {
        e.preventDefault();
        this.props.dispatch({ type: OutputActionTypes.UPLOAD });
        axios
            .post(
                '/api/practicals/' +
                    this.props.practicalID +
                    '/output',
                this.props.items,
                { withCredentials: true }
            )
            .then(data => {
                this.props.dispatch({ type: OutputActionTypes.UPLOADED });
            })
            .catch(err => {
                //TODO: Error
                // alert('Error');
                // props.dispatch({ type: InformationActionTypes.UPLOAD });
            });
    };
    render() {
        // const classes = this.useStyles();
        return (
            <Container>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <h2 style={{ flex: 1 }}>Output</h2>
                    <Button
                        color={this.props.uploaded ? 'primary' : 'secondary'}
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
                    onImageUpdate={this.onImageUpdate}
                    onDeleteItem={this.onDeleteItem}
                    onUpdate={this.onItemDeleteHandler}
                    onSortEnd={this.onSortEnd}
                />
                <Grid container spacing={1} justify="center">
                    <Grid item>
                        <Fab
                            variant="extended"
                            color="primary"
                            aria-label="add"
                            onClick={this.newImageClick}
                        >
                            <AddPhotoAlternate
                                spacing={1}
                                style={{ marginRight: '8px' }}
                            />
                            New Image
                        </Fab>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    // alert(JSON.stringify(state.OutputReducer.outputSections))
    return {
        ...state.PracticalReducer,
        items: state.OutputReducer.outputSections,
        uploaded: state.OutputReducer.uploaded
    };
};
const mapDispatchToProps = dispatch => {
    return {
        dispatch
        // swapItems: ()=>dispatch({type: OutputActionTypes,})
    };
};
export default connect(mapStateToProps)(Output);
