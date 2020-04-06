import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

class ProfileTabs extends React.PureComponent {
    state = { activeIndex: 0 };

    handleChange = (_, activeIndex) => this.setState({ activeIndex });
    render() {
        const { activeIndex } = this.state;
        return (
            <div
                style={{
                    display: 'flex',
                    flex: 1
                }}
            >
                <VerticalTabs
                    value={activeIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    onChange={this.handleChange}
                >
                    <MyTab label="item one" />
                    <MyTab label="item two" />
                    <MyTab label="item three" />
                </VerticalTabs>

                {activeIndex === 0 && (
                    <TabContainer>
                        Item One
                        <br />
                        asd
                    </TabContainer>
                )}
                {activeIndex === 1 && <TabContainer>Item Two</TabContainer>}
                {activeIndex === 2 && <TabContainer>Item Three</TabContainer>}
            </div>
        );
    }
}

const VerticalTabs = withStyles(theme => ({
    flexContainer: {
        flexDirection: 'column'
    },
    indicator: {
        display: 'none'
    }
}))(Tabs);

const MyTab = withStyles(theme => ({
    selected: {
        color: 'tomato',
        borderBottom: '2px solid tomato'
    }
}))(Tab);

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 24 }}>
            {props.children}
        </Typography>
    );
}

export default ProfileTabs;
