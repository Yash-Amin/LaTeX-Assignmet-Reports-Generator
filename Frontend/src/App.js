import React from 'react';
import './App.css';
import Editor from './Pages/Editor';
import { createStore } from 'redux';
import { Reducer } from './Store/Store';
import { Provider } from 'react-redux';
import LoginPage from './Pages/Login';
import SignupPage from './Pages/Signup';
import { Route, BrowserRouter } from 'react-router-dom';
import PracticalPage from './Pages/Practicals';
import axios from './axiosInstance';
// State ---------------------

const AppStore = createStore(
    Reducer
,    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// State --------------------- >

class App extends React.Component {
    state = {
        isLoading: true,
        isLoggedIn: false,
        email: '',
        started: false
    };

    shouldComponentUpdate(newState, newProps) {
        return newState.isLoggedIn || !newState.isLoading;
    }

    checkLogin = () => {
        if (this.state.started) {
            return;
        }

        this.setState({ ...this.state, started: true, isLoading: true });
        // alert('App' + axios.defaults.baseURL);
        axios
            .get('/api/users', { withCredentials: true })
            .then(res => {
                if (res.data && res.data.email) {
                    this.setState({
                        ...this.state,
                        isLoading: false,
                        isLoggedIn: true,
                        email: res.data.email
                    });
                } else {
                    this.setState({
                        ...this.state,
                        isLoading: false,
                        isLoggedIn: false
                    });
                    // window.location.href = '/login';
                    if (this.historyProp) {
                        this.historyProp.push({ pathname: '/login' });
                    } else {
                        window.location.href = '/login';
                    }
                }
            })
            .catch(err => {
                // this.setState({
                //     ...this.state,
                //     isLoading: false,
                //     isLoggedIn: false
                // });
                // this.props.history.push({ pathname: '/login' });
                if (this.historyProp) {
                    this.historyProp.push({ pathname: '/login' });
                } else {
                    window.location.href = '/login';
                }
                console.log(err);
            });
    };
    historyProp = null;

    onLoggedInHandler = email => {
        this.setState({ ...this.state, isLoggedIn: true, email: email });
    };

    render() {
        // if (!this.state.started){
        // this.checkLogin();
        //   }
        return (
            //     <div className="App">
            //         <header className="App-header">
            //             <img src={logo} className="App-logo" alt="logo" />
            //         </header>
            //     </div>
            <Provider store={AppStore}>
                <BrowserRouter>
                    <Route
                        path="/"
                        exact
                        render={props => {
                            this.historyProp = props.history;
                            this.checkLogin();
                            if (this.state.isLoggedIn) {
                                // THISS
                                // return <Editor {...props} />;
                                return <PracticalPage {...props} />;
                            }
                            // this.props.history.push({ pathname: '/login' });
                            return <div />;
                        }}
                    />
                    <Route
                        path="/editor"
                        exact
                        render={props => {
                            this.historyProp = props.history;
                            this.checkLogin();
                            if (this.state.isLoggedIn) {
                                return <Editor {...props} />;
                            }
                            return <div />;
                        }}
                    />

                    <Route
                        exact
                        path="/login"
                        // onLoggedInHandler={this.onLoggedInHandler}
                        // component={LoginPage}
                        render={props => {
                            return (
                                <LoginPage
                                    {...props}
                                    onLoggedInHandler={this.onLoggedInHandler}
                                />
                            );
                        }}
                    />

                    <Route
                        exact
                        path="/signup"
                        // onLoggedInHandler={this.onLoggedInHandler}
                        // component={LoginPage}
                        render={props => {
                            return (
                                <SignupPage
                                    {...props}
                                    onLoggedInHandler={this.onLoggedInHandler}
                                />
                            );
                        }}
                    />
                </BrowserRouter>
                {/* <LoadingPage /> */}
                {/* <h1>zzz</h1> */}

                {/* <div className="App"> */}
                {/* <Editor /> */}
                {/* <LoginPage> </LoginPage> */}
                {/* </div> */}
            </Provider>
        );
    }
}

export default App;
