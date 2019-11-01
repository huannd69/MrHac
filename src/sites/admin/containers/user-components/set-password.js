import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class SetPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataUser: this.props.data,
            passwordNew: '',
            confirmPassword: '',
        };
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.passwordNew) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length < 8)
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    updatePassword = () => {
        const { dataUser, passwordNew, confirmPassword } = this.state;
        let id = dataUser && dataUser.user ? dataUser.user.id : '';
        let object = {
            // passwordOld: dataUser.user.password,
            passwordNew: md5(passwordNew)
        }
        userProvider.updatePassword(id, object).then(s => {
            if (s && s.code == 0) {
                toast.success("Thiết lập mật khẩu thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            }
            if (s.code == 2) {
                toast.success("Mật khẩu mới không được giống mật khẩu cũ!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch(e => {
            toast.error("Thiết lập mật khẩu không thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }

    render() {
        const { classes } = this.props;
        const { dataUser, passwordNew, confirmPassword } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.updatePassword}>
                        <DialogTitle id="alert-dialog-slide-title">
                            Thiết lập mật khẩu
                    </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        type="password"
                                        value={passwordNew} id="password" name="password" label="Mật khẩu (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.setState({ passwordNew: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'minPassword']}
                                        errorMessages={['Mật khẩu không được bỏ trống!', 'Mật khẩu dài ít nhất 8 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        type="password"
                                        value={confirmPassword}
                                        id="confirm-password" name="confirmPassword" label="Nhập lại mật khẩu (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.setState({ confirmPassword: event.target.value }) }}
                                        margin="normal"
                                        validators={['isPasswordMatch', 'required']}
                                        errorMessages={['Mật khẩu và nhập lại mật khẩu không giống nhau!', 'Nhập lại mật khẩu không được bỏ trống!']}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            <Button variant="contained" color="primary" type="submit">Ok</Button>
                        </DialogActions>
                    </ValidatorForm>
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
    }, helpBlock: {
        color: 'red'
    },
});

export default withStyles(styles)(connect(mapStateToProps)(SetPassword));