import React from 'react';
import PropTypes, { func } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ReferenceTab from '../Components/Editor/Reference';
import InformationTab from '../Components/Editor/Information';
import TheoryTab from '../Components/Editor/Theory';
import CodeTab from '../Components/Editor/Code';
import { connect } from 'react-redux';
import Question from '../Components/Editor/Question';
import Output from '../Components/Editor/Output';
import LatexTab from '../Components/Editor/Latex';
import axios from '../axiosInstance';
import {
    TheoryActionTypes,
    ReferenceActionTypes,
    QuestionActionTypes,
    OutputActionTypes,
    InformationActionTypes,
    CodeActionTypes
} from '../Store/Store';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper
    }
}));

function ScrollableTabsButtonAuto(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        if (value != newValue && newValue == 7) {
            axios
                .get('/api/practicals/' + props.practicalID + '/latex')
                .then(data => {
                    // setValues({ new: true, latex: data.data });
                    data = data.data;
                    if (props.latex.latex != data) {
                        props.dispatch({
                            type: 'LATEX_SET',
                            payload: {
                                latex: data,
                                practical: props.practicalID
                            }
                        });
                    }
                })
                .catch(err => {
                    props.dispatch({
                        type: 'LATEX_SET',
                        payload: {
                            latex: 'Error.',
                            practical: props.practicalID
                        }
                    });

                });
        }

        setValue(newValue);
    }
    if (!props.practicalID) {
        props.history.push('/');
        return <div />;
    } else if (props.practicalID === '' || isNaN(props.practicalID)) {
        props.history.push('/');
        return <div />;
    }

    // syncData(props.dispatch, props.practicalID);

    return (
        <div className={classes.root} style={{ paddingTop: 56 }}>
            <AppBar
                position="static"
                color="default"
                style={{ position: 'fixed', top: 64 }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Information" {...a11yProps(0)} />
                    <Tab label="Theory" {...a11yProps(1)} />
                    <Tab label="Code" {...a11yProps(2)} />
                    <Tab label="Output" {...a11yProps(3)} />
                    <Tab label="Questions" {...a11yProps(4)} />
                    <Tab label="References" {...a11yProps(5)} />
                    <Tab label="PDF Download" {...a11yProps(6)} />
                    <Tab label="LaTeX Code" {...a11yProps(7)} />
                    {/* <Tab label="Download" {...a11yProps(6)} /> */}
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <InformationTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TheoryTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                {/* CODE */}
                <CodeTab />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Output />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <Question />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <ReferenceTab />
            </TabPanel>
            <TabPanel value={value} style={{ padding: 0, margin: 0 }} index={6}>
                {value == 6 ? (
                    <div
                        style={{
                            width: '100%',
                            height: '70vh',
                            margin: 0,
                            padding: 0
                        }}
                    >
                        <iframe
                            style={{ height: '100%', width: '100%' }}
                            src={
                                axios.defaults.baseURL
                                    ? axios.defaults.baseURL +
                                      'api/practicals/' +
                                      props.practicalID +
                                      '/pdf/preview'
                                    : '/api/practicals/' +
                                      props.practicalID +
                                      '/pdf/preview'
                            }
                        />
                    </div>
                ) : (
                    <div />
                )}
            </TabPanel>
            <TabPanel value={value} index={7}>
                <LatexTab   />
            </TabPanel>
        </div>
    );
}

const mapStateToProps = state => {
    var practicals = state.PracticalReducer;
    // alert(practicals)
    return { ...practicals, latex: state.LatexReducer };
};

export default connect(mapStateToProps)(ScrollableTabsButtonAuto);
