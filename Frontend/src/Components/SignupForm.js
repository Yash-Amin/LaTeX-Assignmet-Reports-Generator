import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from '../axiosInstance'
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';

export class LoginForm extends React.Component {
    state = {
        email: '',
        password: '',
        confirmPassword: '',
        open: false,
        err: ''
    };

    showError = err => {
        this.setState({ ...this.state, open: true, err: err });
    };
    onLoggedin = () => {
        axios
            .get('/api/users', { withCredentials: true })
            .then(res => {
                // var user = { email: res.data.email };
                // this.props.dispatch({
                //     type: UserActionTypes.SET_USER,
                //     payload: user
                // });
                this.showError('Signup success');
                alert('Signup success. (function-2)')
                // alert('Logged in!')
                // this.props.onLoggedInHandler(user.email);
                this.props.history.push('/login');
            })
            .catch(err => {
                this.showError(err.data.message);
            });
    };

    onSubmitClick = e => {
        e.preventDefault();
        // this.showError('Hello !');
        this.setState({ ...this.state, open: false });
        if (this.state.email.trim() == '') {
            return this.showError('Enter email!');
        } else if (this.state.password == '') {
            return this.showError('Enter password!');
        }  else if (this.state.confirmPassword == '') {
            return this.showError('Enter password!');
        }   else if (this.state.confirmPassword !=  this.state.password) {
            return this.showError('Passwords do not match!');
        } 

        // this.props.dispatch({ type: UserActionTypes.LOGIN });
        axios
            .post(
                '/api/users/register',
                {
                    email: this.state.email,
                    password: this.state.password
                },
                {
                    withCredentials: true
                }
            )
            .then(res => {
                // alert(JSON.stringify(res));
                // this.props.dispatch({ type: UserActionTypes.LOGIN_COMPLETE });
                // this.onLoggedin();
                this.props.history.push('/login')
            })
            .catch(err => {
                try {
                    err = err.response.data.message;
                    if (err) {
                        this.showError(String(err));
                    }
                } catch (x) {
                    this.showError('ServerError, Please try again');
                    // alert(x)
                }
                // alert(JSON.stringify(err.response));
                // this.showError(err.response);
            });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
    };

    getSnackbar = () => {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
                message={<span id="message-id">{this.state.err}</span>}
                action={[
                    ,
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={this.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        );
    };

    handleInputChange = event => {
        const newState = { ...this.state };
        newState[event.target.name] = event.target.value;
        this.setState(newState);

        // this.props.dispatch({
        //     type: CodeActionTypes.UPDATE_ITEM,
        //     payload: newState
        // });

        // var a = 10;
        // setState({ ...state, [event.target.name]: event.target.value });
    };

    render() {
        let classes = this.props.classes;
        let progress = this.props.isLoading ? (
            <CircularProgress className={classes.progress} color="secondary" />
        ) : (
            <div />
        );
        return (
            <div>
                <Typography component="h1" variant="h5" align="center">
                    Sign up
                </Typography>
                {this.getSnackbar()}
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={this.handleInputChange}
                        value={this.state.email}
                        label="Charusat Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        onChange={this.handleInputChange}
                        margin="normal"
                        required
                        value={this.state.password}
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        variant="outlined"
                        onChange={this.handleInputChange}
                        margin="normal"
                        required
                        value={this.state.confirmPassword}
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    {/* <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    /> */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {progress}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={this.props.isLoading}
                        onClick={this.onSubmitClick}
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs />
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Log in"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Box mt={10}>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                        >
                            {'Developed by '}
                            <b>{'Amin Yash'}</b>
                        </Typography>{' '}
                    </Box>
                </form>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return state.UserReducer;
};

export default connect(mapStateToProps)(withRouter(LoginForm));
