// import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {
    Paper,
    Button,
    IconButton,
    ButtonBase,
    FormControl,
    Grid
} from '@material-ui/core';
import axios from '../../../axiosInstance';
import Select from '@material-ui/core/Select';
import { Delete, DragIndicator } from '@material-ui/icons';
import { SortableHandle } from 'react-sortable-hoc';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { ImageActionTypes } from '../../../Store/Store';
import { height } from '@material-ui/system';
import {
    OutputActionTypes,
    TheoryActionTypes,
    QuestionActionTypes
} from '../../../Store/Store';

import MenuIcon from '@material-ui/icons/Menu';
const DragHandle = SortableHandle(() => (
    <MenuIcon
        style={{ cursor: 'move', paddingLeft: '8px', paddingRight: '8px' }}
    />
));

class OutputImageSection extends Component {
    state = {
        type: 'image',
        id: this.props.id,
        captionNum: '',
        caption: this.props.caption,
        width: this.props.width,
        url: '',
        imageID: this.props.imageID ? this.props.imageID : '',
        height: this.props.height,
        uploaded: this.props.uploaded ? this.props.uploaded : false,
        uploading: this.props.uploading ? this.props.uploading : false,
        selectedFile: this.props.selectedFile ? this.props.selectedFile : ''
    };

    uploadImage = file => {
        const data = new FormData();

        const config = {
            withCredentials: true,
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        data.append('ss', file);
        // alert('QUESTION IMAGE ')
        axios
            .post('/api/images/', data, config)
            .then(res => {
                console.log(res);
                // alert('Uploaded, OP ' + JSON.stringify(res.data.filename) + '::');
                let newState = {
                    ...this.state,
                    uploading: false,
                    uploaded: true,
                    imageID: res.data.filename
                };
                this.setState(newState);
                this.props.dispatch({
                    type: OutputActionTypes.UPDATE_ITEM,
                    payload: newState
                });
                console.log(this.state);
                // console.log(this.props.onImageUpdate);
                // alert(JSON.stringify(this.props.onImageUpdate));
                this.props.onImageUpdate(newState);
            })
            .catch(err => {
                console.log(err);
                let newState = {
                    ...this.state,
                    uploading: false,
                    uploaded: false
                };
                this.setState(newState);
                alert('Error while uploading');
            });
    };

    handleInputChange = event => {
        const newState = { ...this.state };

        newState[event.target.name] = event.target.value;
        if (event.target.name == 'opFileUpload') {
            console.log(event.target.files[0]);
            newState.selectedFile = event.target.files[0];
            newState.uploaded = false;
            // alert('Op imageee ')
            newState.uploading = true;
            this.uploadImage(newState.selectedFile);
        }
        this.setState(newState);
        this.props.onImageUpdate(newState);
        // // THISSS
        // this.props.dispatch({
        //     type: OutputActionTypes.UPDATE_ITEM,
        //     payload: newState
        // });

        // var a = 10;
        // setState({ ...state, [event.target.name]: event.target.value });
    };

    render() {
        // alert(JSON.stringify(this.props) + JSON.stringify(this.state))

        // alert(JSON.stringify('QUESTION IMAGEEE RET'))
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
                    <FormControl style={{ flexDirection: 'row' }}>
                        <p style={{ marginTop: 0, marginBottom: 0 }}>Image</p>
                    </FormControl>
                    <div style={{ flex: 1, color: '#212121' }} />
                    <IconButton
                        onClick={() => {
                            this.props.onDeleteItem(this.state);
                            // this.props.dispatch({
                            //     type: ImageActionTypes.DELETE_ITEM,
                            //     payload: { id: this.state.id }
                            // });
                            // THISS

                            // console.log(this.props.onUpdate);
                            setTimeout(() => this.props.onUpdate(), 200);
                        }}
                    >
                        <Delete color="error" />
                    </IconButton>
                </div>

                <Grid
                    container
                    justify="center"
                    style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#E8E8E8'
                    }}
                >
                    <Grid item xs={3} style={{ display: 'flex' }}>
                        <ButtonBase style={{ margin: 'auto' }}>
                            <img
                                src={
                                    this.state.imageID != ''
                                        ? '/api/images/' + this.state.imageID
                                        : '/img.png'
                                }
                                style={
                                    this.state.imageID != ''
                                        ? {
                                              height: '100px',
                                              maxHeight: '100%',
                                              maxWidth: '100%',
                                              border: '1px solid #303030'
                                          }
                                        : {
                                              height: '100px',
                                              maxHeight: '100%',
                                              maxWidth: '100%'
                                          }
                                }
                            />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={9}>
                        <Grid container alignContent="center">
                            {/* <Grid item>
                                <TextField
                                    name="captionNum"
                                    style={{ marginLeft: '8px' }}
                                    label="Caption number"
                                    value={this.state.captionNum}
                                    onChange={this.handleInputChange}
                                />
                            </Grid> */}
                            <Grid item>
                                <TextField
                                    name="caption"
                                    style={{ marginLeft: '8px' }}
                                    label="Caption"
                                    value={this.state.caption}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="width"
                                    style={{ marginLeft: '8px' }}
                                    label="Width"
                                    value={this.state.width}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="height"
                                    style={{ marginLeft: '8px' }}
                                    label="Height"
                                    value={this.state.height}
                                    onChange={this.handleInputChange}
                                />
                            </Grid>
                            <Grid item style={{ padding: '8px' }}>
                                <p>{JSON.stringify(this.state)}</p>
                            </Grid>
                            <Grid item style={{ padding: '8px' }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    name="opFileUpload"
                                    onChange={this.handleInputChange}
                                    id={"file-upload-button-op" + this.state.id}
                                    type="file"
                                />
                                <label htmlFor={"file-upload-button-op" + this.state.id}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        // variant="raised"
                                        disabled={
                                            this.state.uploaded ||
                                            this.state.uploading
                                        }
                                        component="span"
                                        // className={classes.button}
                                    >
                                        {this.state.uploading
                                            ? 'Uploading'
                                            : this.state.uploaded
                                            ? 'Uploaded'
                                            : 'Upload'}
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         items: state. OutputImageSections
//     };
// };
// const mapDispatchToProps = dispatch => {
//     return {
//         dispatch
//         // swapItems: ()=>dispatch({type: ImageActionTypes,})
//     };
// };
// export default connect(mapStateToProps)( OutputImageSection);
export default connect()(OutputImageSection);
