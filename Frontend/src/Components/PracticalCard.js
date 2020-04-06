import React, { Component } from 'react';
import axios from '../axiosInstance'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'; 

import {
    PracticalActionTypes,
    CodeActionTypes,
    InformationActionTypes,
    OutputActionTypes,
    QuestionActionTypes,
    ReferenceActionTypes,
    TheoryActionTypes
} from '../Store/Store';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

export class PracticalCard extends Component {
    state = {
        hasData: false,
        practicals: [],
        error: false
    };

    componentDidMount() {
        if (this.state.hasData || this.state.error) {
            return;
        }

        axios
            .get('/api/practicals')
            .then(res => {
                this.setState({
                    ...this.state,
                    practicals: res.data.data,
                    hasData: true
                });
            })
            .catch(err => {
                this.setState({ ...this.state, error: true });
            });
    }
    getData = (op, dispatch, practicalID) => {
        axios.get('/api/practicals/' + practicalID + op.operation, {
            withCredentials: true
        })
            .then(data => {
                data = data.data;
                dispatch({ type: op.type, payload: data });
                // alert(JSON.stringify(data.data));
            })
            .catch(err => {
                // alert(JSON.stringify(err));
            });
    };

    syncData = (dispatch, practicalID) => {
        var ops = [
            { operation: '/theory', type: TheoryActionTypes.ADD },
            { operation: '/code', type: CodeActionTypes.ADD },
            { operation: '/reference', type: ReferenceActionTypes.ADD },
            { operation: '/questions', type: QuestionActionTypes.ADD },
            { operation: '/output', type: OutputActionTypes.ADD },
            { operation: '/details', type: InformationActionTypes.ADD }
        ];
        for (var op of ops) {
            this.getData(op, dispatch, practicalID);
        }
    };

    render() {
        var classes = this.props.classes;

        if (this.state.error) {
            return <h1>Error, Try again!</h1>;
        }
        if (!this.state.hasData) {
            return (
                <Grid container justify={'center'} style={{paddingTop: 50}}>
                    <CircularProgress className={''} color="secondary" />
                </Grid>
            );
        }

        return (
            <Container style={{ width: 650 }}>
                <Grid container spacing={2}>
                    {this.state.practicals.map(practical => {
                        return (
                            <Grid item xs={12}>
                                <Card className={classes.card}>
                                    <CardActionArea
                                        onClick={() => {
                                            if (
                                                this.props.practicalID !=
                                                practical.id
                                            ) {
                                                this.props.dispatch({
                                                    type:
                                                        PracticalActionTypes.SET_PRACTICAL,
                                                    payload: {
                                                        practicalID:
                                                            practical.id,
                                                        practicalName:
                                                            practical.name,
                                                        practicalAim:
                                                            practical.aim
                                                    }
                                                });
                                                this.props.dispatch({
                                                    type:
                                                        InformationActionTypes.CLEAR
                                                });
                                                this.props.dispatch({
                                                    type:
                                                        TheoryActionTypes.CLEAR
                                                });
                                                this.props.dispatch({
                                                    type: CodeActionTypes.CLEAR
                                                });
                                                this.props.dispatch({
                                                    type:
                                                        OutputActionTypes.CLEAR
                                                });
                                                this.props.dispatch({
                                                    type:
                                                        QuestionActionTypes.CLEAR
                                                });
                                                this.props.dispatch({
                                                    type:
                                                        ReferenceActionTypes.CLEAR
                                                });
                                            }
                                            this.syncData(
                                                this.props.dispatch,
                                                practical.id
                                            );
                                        this.props.history.push('/editor');
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                            >
                                                {practical.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                component="p"
                                            >
                                                {practical.aim}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    // alert(JSON.stringify(state.TheoryReducer.theorySections))
    return {
        ...state.PracticalReducer
        // ...state
    };
};

export default withRouter(connect(mapStateToProps)(PracticalCard));
