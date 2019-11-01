import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';


class ToolbarCpn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { numSelected, classes, title, actionsChiren } = this.props;
        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}>
                <div className={classes.title}>
                    {numSelected > 0 ?
                        <Typography color="inherit" variant="subtitle1"> {numSelected} Đã chọn</Typography> 
                        :
                        <Typography variant="h6" id="tableTitle">{title}</Typography>
                    }
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {actionsChiren}
                </div>
            </Toolbar>
        );
    }
};

ToolbarCpn.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    // spacer: {
    //     flex: '1 1 100%',
    // },
    actions: {
        flex: '1 1 100%',
        color: theme.palette.text.secondary,
        textAlign:'right'
    },
    title: {
        flex: '0 0 auto',
    },
});

export default withStyles(toolbarStyles)(ToolbarCpn);