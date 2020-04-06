import React, { useState } from 'react';
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

function row() {}

function Latex(props) {
    const classes = useStyles();
    var tmpState = {
        latex: '',
        new: false
    };
    const [values, setValues] = React.useState(tmpState);
    // if (!values.new && props.latex != '') {
    //     axios
    //         .get('/api/practicals/' + props.practicalID + '/latex')
    //         .then(data => {
    //             setValues({ new: true, latex: data.data });
    //         })
    //         .catch(err => {
    //             setValues({ new: true, latex: 'Error while downloading.' });
    //         });
    // }
    // alert(JSON.stringify(props.latex.latex));
    return (
        <Container>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <h2 style={{ flex: 1 }}>Latex Source</h2>
            </div>
            <div style={{ padding: 30 }}>
                <TextField
                    id="outlined-textarea"
                    placeholder="LaTeX"
                    multiline
                    fullWidth
                    rows={20}
                    value={props.latex.latex}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                />
            </div>
        </Container>
    );
}

const mapStateToProps = state => {
    return {
        ...state.UserReducer,
        ...state.PracticalReducer,
        latex: state.LatexReducer
    };
};
export default connect(mapStateToProps)(Latex);
