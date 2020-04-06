import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Fab, Container, Button } from '@material-ui/core';
import { AddPhotoAlternate, QuestionAnswer } from '@material-ui/icons';

import axios from '../../axiosInstance'

import { connect } from 'react-redux';
import { QuestionActionTypes } from '../../Store/Store';

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

import QuestionSection from '../Editor/Section/QuestionSection';
import { Grid } from '@material-ui/core';
import QuestionImageSection from './Section/QuestionImageSection';

const SortableItem = SortableElement(
    ({ value, onUpdate, onImageUpdate, onDeleteItem }) => {
        return value.type === 'image' ? (
            <QuestionImageSection
                key={value.id}
                uid={value.uid}
                onDeleteItem={onDeleteItem}
                action={QuestionActionTypes.UPDATE_ITEM}
                onUpdate={onUpdate}
                {...value}
                onImageUpdate={onImageUpdate}
            />
        ) : (
            <QuestionSection
                key={value.id}
                onUpdate={onUpdate}
                uid={value.id}
                queOrAns={value.queOrAns}
                text={value.text}
                type={value.type}
            />
        );
    }
);

const SortableList = SortableContainer(
    ({ items, onUpdate, onDeleteItem, onImageUpdate }) => {
        // console.log(SortableItem);
        return (
            <ul>
                {items.map((value, index) => (
                    <SortableItem
                        key={`item-${value.id}`}
                        onImageUpdate={onImageUpdate}
                        index={index}
                        onDeleteItem={onDeleteItem}
                        onUpdate={onUpdate}
                        value={value}
                    />
                ))}
            </ul>
        );
    }
);

export class Question extends Component {
    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex) {
            this.props.dispatch({
                type: QuestionActionTypes.SWAP_SECTION_ITEMS,
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

    newTextClick = () => {
        this.props.dispatch({ type: QuestionActionTypes.NEW_TEXT });
        this.onItemDeleteHandler();
    };

    newImageClick = () => {
        this.props.dispatch({ type: QuestionActionTypes.NEW_IMAGE });
        this.onItemDeleteHandler();
    };

    UploadClick = e => {
        e.preventDefault();
        this.props.dispatch({ type: QuestionActionTypes.UPLOAD });
        axios
            .post(
                '/api/practicals/' + this.props.practicalID + '/questions',
                this.props.items,
                { withCredentials: true }
            )
            .then(data => {
                this.props.dispatch({ type: QuestionActionTypes.UPLOADED });
            })
            .catch(err => {
                //TODO: Error
                alert('Error');
                // props.dispatch({ type: InformationActionTypes.UPLOAD });
            });
    };

    onDeleteItem = img => {
        this.props.dispatch({
            type: QuestionActionTypes.DELETE_ITEM,
            payload: { id: img.id }
        });
        // alert(JSON.stringify(img));
    };
    onImageUpdate = img => {
        // alert(JSON.stringify(img));

        this.props.dispatch({
            type: QuestionActionTypes.UPDATE_ITEM,
            payload: img
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
                        <h2 style={{ flex: 1 }}>Question</h2>
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
                        onImageUpdate={this.onImageUpdate}
                        items={this.props.items}
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
                                onClick={this.newTextClick}
                            >
                                <QuestionAnswer
                                    spacing={1}
                                    style={{ marginRight: '8px' }}
                                />
                                New section
                            </Fab>
                        </Grid>
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
                </div>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    var questionState = state.QuestionReducer;
    // alert(JSON.stringify(questionState))
    return {
        ...state.PracticalReducer,
        items: questionState.questionSections,
        uploaded: state.QuestionReducer.uploaded
    };
};
const mapDispatchToProps = dispatch => {
    return {
        dispatch
        // swapItems: ()=>dispatch({type: QuestionActionTypes,})
    };
};
export default connect(mapStateToProps)(Question);
