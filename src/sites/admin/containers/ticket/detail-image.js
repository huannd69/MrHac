import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import stringUtils from 'mainam-react-native-string-utils';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Col, Row } from 'reactstrap';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailImage  extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: true,
            avatar: this.props.data.avatar,
            isOpen: false,
        }
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    render() {
        const { classes } = this.props;
        const { avatar, photoIndex, isOpen } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <div style={{ right: 0, position: "absolute"}}>
                        <IconButton onClick={this.handleClose} color="primary" className={classes.button} aria-label="RemoveCircle">
                            <RemoveCircle />
                        </IconButton>
                    </div>
                    <img alt="" 
                        // style={{width: "100%", height: "100%"}}
                        src={avatar ? avatar.absoluteUrl() : ""}
                    />
                </Dialog>
            </div >
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

const styles = theme => ({
    row: {
        display: 'flex',
        justifyContent: 'center',
    }, textField: {
        width: '100%'
    }, avatar: {
        margin: 10,
    }, bigAvatar: {
        width: 60,
        height: 60,
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailImage));