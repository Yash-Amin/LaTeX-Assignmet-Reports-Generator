import React, { Component } from 'react';
import HorizontalTabs from './HorizontalTabs';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';

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
    const classes = useStyles();
    // var [practicals, setPracticals] = useStyles({ data: ['hey', 'zz'] });
    var practicals = {
        data: ['a', 'b']
    };
 
    // alert(JSON.stringify(props));

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
                        {props.practicalName}
                    </Typography>
                    {/* <Button color="inherit">{'hey!'}</Button> */}
                </Toolbar>
            </AppBar>

            {/* {practicals.data.map(practical => {
                    return <h3>{practical}</h3>;
                })} */}
            <div style={{ height: 10 }} />
            {/* <PracticalCard
                classes={classes}
                onPracticalClick={onPracticalClick}
            /> */}
            <Editor classes={classes} {...props} />
        </div>
    );
}

class Editor extends Component {
    state = {
        open: false
    };

    setOpen = isOpen => {
        this.setState({ open: isOpen });
    };

    render() {
        // const classes = useStyles(this.props);
        // const theme = useTheme();
        // alert(JSON.stringify(this.props.history));
        // this.props.history.push({ pathname: '/login' });
        return (
            // <div>
            <HorizontalTabs {...this.props} />

            //     <h1>Editor</h1>
            //     <Button variant="contained" color="primary">
            //         Hello World
            //     </Button>
            // </div>
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

export default withRouter(connect(mapStateToProps)(ButtonAppBar));
