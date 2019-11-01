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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import stringUtils from 'mainam-react-native-string-utils';
import ConfirmDialog from '../../components/confirm/';
import dortorInfProvider from '../../../../data-access/doctorInf-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class RejectPost extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataDoctor: this.props.doctorInf,
            reject: '',
            confirmDialog: false,
        };
        this.data = JSON.stringify(this.props.doctorInf);
        this.data2 = this.props.doctorInf;
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 2000)
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    confirmReject = () => {
        this.setState({ confirmDialog: true })
    }
    

    reject = (type) => {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            const { dataDoctor, reject } = this.state;
            let object = {
                reject
            }
            dortorInfProvider.reject(dataDoctor.doctorInf.id, object).then(s => {
                if (s && s.code == 0) {
                    toast.success("Từ chối bác sĩ " + dataDoctor.doctorInf.name + " thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.handleClose();
                }
            }).catch(e => {
                toast.success("Từ chối bác sĩ không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { dataDoctor, reject } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.confirmReject}>
                        <DialogTitle id="alert-dialog-slide-title">
                            Từ chối bác sĩ đăng kí
                    </DialogTitle>
                        <DialogContent style={{ width: 369 }}>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={reject}
                                        id="reject" name="reject" label="Lý do từ chối (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.reject = event.target.value; this.setState({ reject: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Lý do từ chối không được bỏ trống!', 'Không cho phép nhập quá 2000 kí tự!']}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy</Button>
                            {
                                this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit">Từ chối</Button> :
                                    <Button variant="contained" color="primary" disabled>Từ chối</Button>
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn đang thực hiện từ chối đăng ký của bác sĩ " + dataDoctor.doctorInf.name} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.reject.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(RejectPost));