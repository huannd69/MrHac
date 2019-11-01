import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import ConfirmDialog from '../../components/confirm';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import ImageProvider from '../../../../data-access/image-provider';
import roleProvider from '../../../../data-access/role-provider';
import medicineProvider from '../../../../data-access/medicine-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateMedicineCategory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            data: this.props.data,
            name: this.props.data && this.props.data && this.props.data.name ? this.props.data.name : '',
            descirption: this.props.data && this.props.data && this.props.data.descirption ? this.props.data.descirption : '',
            confirmDialog: false,
        };
        debugger
        this.data = JSON.stringify(this.props.data);

        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 255)
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    modalConfirmDialog() {
        if (this.state.updateable) {
            this.setState({
                confirmDialog: true
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    create = () => {
        debugger
        this.setState({ hasErrorGender: false, hasErrorDegree: false });
        const { data, avatar, name, certificateCode, phone, email, dob, gender, specialist, title, degree, password, address, note } = this.state;
        let id = data ? data.id : '';
        let param = data
        if (data && data.id) {
            medicineProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật thuốc " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Tên thuốc đã tồn tại", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 3:
                        toast.error("Người dùng không có quyền sửa thông tin loại thuốc", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;

                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            medicineProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Tạo mới thuốc " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Loại thuốc đã tồn tại trong hệ thống!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 3:
                        toast.error("Người dùng không có quyền sửa thêm loại thuốc", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 4:
                        toast.error("Số văn bằng chuyên môn đã tồn tại trên hệ thống. Vui lòng sử dụng Số văn bằng chuyên môn khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Tạo mới tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }
  

    active = (type) => {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            const { dataUser } = this.state;
            let id = dataUser && dataUser.user ? dataUser.user.id : '';
            let param = { active: dataUser.user.active ? 0 : 1 };
            userProvider.active(id, param).then(s => {
                toast.success("Cập nhật tài khoản " + dataUser.user.name + " thành công", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { data, descirption, name, updateable } = this.state;

        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title">
                            {data &&  data && data.id ? 'Cập nhật loại thuốc ' : 'Tạo mới loại thuốc'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    {data && data && data.id ? 
                                        <TextValidator
                                            value={name}
                                            id="name" name="name" label="Tên thuốc"
                                            className={classes.textField}
                                            
                                            onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength']}
                                            errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                        /> :
                                        <TextValidator
                                            value={name}
                                            id="name" name="name" label="Tên thuốc"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength']}
                                            errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {data &&  data && data.id ? 
                                        <TextValidator
                                            value={descirption}
                                            id="descirption" name="descirption" label="Mô tả"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.descirption = event.target.value; this.setState({ descirption: event.target.value }) }}
                                            margin="normal"
                                        /> :
                                        <TextValidator
                                            value={descirption}
                                            id="descirption" name="descirption" label="Mô tả"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.descirption = event.target.value; this.setState({ descirption: event.target.value }) }}
                                            margin="normal"
                                        />}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            {
                                this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit">Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            }
                            {
                                updateable && data && data.id ?
                                    <Button onClick={() => this.modalConfirmDialog()} variant="contained" color="secondary">{data && data.active ? 'Inactive' : 'Active'}</Button> : null
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {/* {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={data.active ? "Bạn có muốn cập nhật trạng thái từ Active sang Inactive" : "Bạn có muốn cập nhật trạng thái từ Inactive sang Active"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.active.bind(this)} />} */}
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
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateMedicineCategory));