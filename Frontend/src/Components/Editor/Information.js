import React, { useState } from 'react';
import { InformationActionTypes } from '../../Store/Store';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../../axiosInstance';
import TextField from '@material-ui/core/TextField';

import {
    Container,
    Box,
    Paper,
    Button,
    Divider,
    Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    dense: {
        marginTop: theme.spacing(2)
    },
    menu: {
        width: 200
    }
}));

function Information(props) {
    const classes = useStyles();
    const forceUpdate = React.useCallback(() => {
        return {};
    }, []);
    var tmpState = {
        subject: 'CE:346 Mobile App Development',
        id: String(props.email)
            .replace('@charusat.edu.in', '')
            .toUpperCase(),
        // name: props.email.replace('@charusat.edu.in', ''),
        footer: 'C.S.P.I.T.',
        pageStart: 1,
        aim: props.practicalAim,
        knowledge: '',
        hwReq: '',
        swReq: 'Android Studio v3.1'
    };
    const [values, setValues] = React.useState(tmpState);
    if (
        !values.new &&
        props.newData.practicalID &&
        props.newData.practicalID != ''
    ) {
        tmpState = { new: true, ...props.newData };
        setValues(tmpState);
    }

    // alert("'" + values.id + "'");

    // alert('s ' + JSON.stringify(props));

    const handleChange = name => event => {
        var newState = { ...values, [name]: event.target.value };
        setValues(newState);
        // alert(1);
        props.dispatch({
            type: InformationActionTypes.UPDATE_ITEM,
            payload: { ...newState }
        });
    };
    const UploadClick = e => {
        e.preventDefault();
        props.dispatch({ type: InformationActionTypes.UPLOAD });
        axios
            .post('/api/practicals/' + props.practicalID + '/details', values, {
                withCredentials: true
            })
            .then(data => {
                props.dispatch({ type: InformationActionTypes.UPLOADED });
            })
            .catch(err => {
                //TODO: Error
                alert('Error');
                // props.dispatch({ type: InformationActionTypes.UPLOAD });
            });
    };
    return (
        <form className={classes.container} noValidate autoComplete="off">
            <Container>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <h2 style={{ flex: 1 }}>Document Details</h2>
                    <Button
                        color={props.uploaded ? 'primary' : 'secondary'}
                        style={{ height: 'fit-content' }}
                        variant="contained"
                        onClick={UploadClick}
                    >
                        {props.uploaded ? 'Saved' : 'Not Saved'}
                    </Button>
                </div>
                <Grid container spacing={1} alignItems={'stretch'}>
                    <Grid item xs={3}>
                        <TextField
                            label="Subject"
                            className={classes.textField}
                            value={values.subject}
                            fullWidth
                            // style={{ width: '300px' }}
                            onChange={handleChange('subject')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="ID"
                            fullWidth
                            className={classes.textField}
                            value={values.id}
                            // style={{ width: '300px' }}
                            onChange={handleChange('id')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Bootom-Left Footer"
                            className={classes.textField}
                            value={values.footer}
                            // style={{ width: '300px' }}
                            fullWidth
                            onChange={handleChange('footer')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Page number starts from"
                            className={classes.textField}
                            value={values.pageStart}
                            // style={{ width: '300px' }}
                            fullWidth
                            onChange={handleChange('pageStart')}
                            margin="normal"
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
                <h2>Practical Details</h2>
                <TextField
                    id="outlined-name"
                    label="Aim"
                    // style={{ flex: 1 }}
                    className={classes.textField}
                    value={values.aim}
                    onChange={handleChange('aim')}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="outlined-name"
                    label="Hardware Requirement"
                    fullWidth
                    className={classes.textField}
                    value={values.hwReq}
                    onChange={handleChange('hwReq')}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="outlined-name"
                    label="Software Requirement"
                    className={classes.textField}
                    value={values.swReq}
                    onChange={handleChange('swReq')}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    id="outlined-name"
                    label="Knowledge Required"
                    className={classes.textField}
                    value={values.knowledge}
                    onChange={handleChange('knowledge')}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
            </Container>
        </form>
    );
}

const mapStateToProps = state => {
    return {
        ...state.PracticalReducer,
        ...state.InformationReducer,
        newData: { ...state.InformationReducer },
        ...state.UserReducer
        // ...state
    };
};
export default connect(mapStateToProps)(Information);
