import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { List, Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {UserActionTypes} from '../Store/Store'

import PracticalCard from '../Components/PracticalCard';
import { connect } from 'react-redux';
import axios from '../axiosInstance'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

function ButtonAppBar(props) {
    axios
        .get('/api/users', { withCredentials: true })
        .then(res => {
            var user = { email: res.data.email };
             props.dispatch({
                type: UserActionTypes.SET_USER,
                payload: user
            });
             // alert('Logged in!')
            this.props.onLoggedInHandler(user.email);
        })
        .catch(err => {});

    const classes = useStyles();
    // var [practicals, setPracticals] = useStyles({ data: ['hey', 'zz'] });
    var practicals = {
        data: ['a', 'b']
    };

    var onPracticalClick = practical => {
        alert('Practical: ' + practical.name);
    };

    var onLogOutClick = () => {
        // alert('Hey!')
        axios.post(
            '/api/users/logout',
            {},
            { withCredentials: true }
        )
            .then(() => {
                props.history.push('/login');
            })
            .catch(() => {
                props.history.push('/login');
            });
    };

    return (
        <div className={classes.root} style={{ paddingTop: 56 }}>
            <AppBar position="static" style={{ position: 'fixed', top: 0 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Practicals
                    </Typography>
                    <Button color="inherit" onClick={onLogOutClick}>
                        Log out
                    </Button>
                </Toolbar>
            </AppBar>

            {/* {practicals.data.map(practical => {
                    return <h3>{practical}</h3>;
                })} */}
            <div style={{ height: 24 }} />
            <PracticalCard
                classes={classes}
                onPracticalClick={onPracticalClick}
            />
        </div>
    );
}

const mapStateToProps = state => {
    var practicals = state.PracticalReducer;
    return { ...practicals };
};

export default connect(mapStateToProps)(ButtonAppBar);
