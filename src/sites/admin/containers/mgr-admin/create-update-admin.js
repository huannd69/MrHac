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
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from '../../components/confirm/';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import SetPassword from '../user-components/set-password';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateAdmin extends React.Component {
    constructor(props) {
        super(props)
        let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 2).length > 0;
        let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 4).length > 0;

        this.state = {
            open: true,
            dataUser: this.props.data,
            dataUserTemp: this.props.data,
            listRoleAdd: this.props.role,
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : '',
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : '',
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : '',
            username: this.props.data && this.props.data.user && this.props.data.user.username ? this.props.data.user.username : '',
            password: this.props.data && this.props.data.user && this.props.data.user.password ? this.props.data.user.password : '',
            roles: this.props.data && this.props.data.role && this.props.data.role ? this.props.data.role.id : ((this.props.role[0]||[]).roles||{}).id,
            confirmDialog: false,
            modalSetPassword: false,
            createable,
            updateable,
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isNickname', (value) => {
            var re = /^([a-zA-Z0-9_])*$/g;
            if (!value) {
                return true
            }
            return re.test(value.toLowerCase());
        });
        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value) {
                return true
            } else {
                return value.isPhoneNumber();
            }
        });
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 255)
                return false
            return true
        });
        ValidatorForm.addValidationRule('maxLength50', (value) => {
            if (value.length > 50)
                return false
            return true
        });
        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length < 8)
                return false
            return true
        });
        ValidatorForm.addValidationRule('maxPhone', (value) => {
            if (value.length > 20)
                return false
            return true
        });
        ValidatorForm.addValidationRule('chosseRole', (value) => {
            if (value == -1)
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    create = () => {
        const { dataUser, name, email, phone, address, username, password, roles } = this.state;
        let id = dataUser && dataUser.user ? dataUser.user.id : '';
        let param = {
            user: {
                name: name.trim(),
                email,
                phone,
                address: address.trim(),
                username,
                password: md5(password),
                role: 4,
                active: 1,
            }, roleId: roles
        }
        // console.log(param);
        if (dataUser && dataUser.user && dataUser.user.id) {
            userProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật tài khoản " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 3:
                        toast.error("Email đã được sử dụng trong hệ thống. Vui lòng sử dụng Email khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 5:
                        toast.error("Username đã tồn tại trên hệ thống. Vui lòng sử dụng Username khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Cập nhật tài khoản không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            userProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Tạo mới tài khoản " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 3:
                        toast.error("Email đã được sử dụng trong hệ thống. Vui lòng sử dụng Email khác!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 5:
                        toast.error("Username đã tồn tại trên hệ thống. Vui lòng sử dụng Username khác!", {
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

    modalSetPassword() {
        if (this.state.updateable){
             this.setState({ modalSetPassword: true })
        } else {
         toast.error("Unauthorized error!", {
             position: toast.POSITION.TOP_RIGHT
           });
        }
     }

     modalConfirmDialog(){
        if (this.state.updateable){
            this.setState({
                confirmDialog: true
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
    }

    closeModal() {
        this.setState({ modalSetPassword: false });
    }

    render() {
        const { classes } = this.props;
        const { dataUser, listRoleAdd, name, email, phone, address, username, password, roles, updateable } = this.state;
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
                            {dataUser.user && dataUser.user.id ? 'Cập nhật tài khoản nhân viên ' : 'Tạo tài khoản nhân viên'}
                            {
                                dataUser.user && dataUser.user.id && updateable ?
                                    <Button style={{ float: 'right' }} onClick={() => this.modalSetPassword()} variant="contained" color="inherit">Set password</Button> : ''
                            }
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6}>
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Họ và tên (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.roles == -1 ? null : <div style={{ position: "absolute", top: 87 }}>Role</div>
                                    }
                                    <SelectValidator
                                        value={roles}
                                        onChange={(event) => { this.data2.roles = event.target.value; this.setState({ roles: event.target.value }) }}
                                        inputProps={{ name: 'selectRole', id: 'selectRole' }}
                                        displayEmpty
                                        validators={["chosseRole"]}
                                        errorMessages={["Vui lòng chọn role!"]}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listRoleAdd.map((option, index) =>
                                                <MenuItem key={index} value={option.roles.id}>{option.roles.name}</MenuItem>
                                            )
                                        }
                                    </SelectValidator>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextValidator
                                        value={email}
                                        id="email" name="email" label="Email (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.email = event.target.value; this.setState({ email: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'isEmail', 'maxLength']}
                                        errorMessages={['Email không được bỏ trống!', 'Email không hợp lệ!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextValidator
                                        value={phone}
                                        id="phone" name="phone" label="Số điện thoại (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.phone = event.target.value; this.setState({ phone: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxPhone', 'isPhone']}
                                        errorMessages={['Số điện thoại không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!', 'Số điện thoại không hợp lệ! ']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={address}
                                        id="address" name="address" label="Địa chỉ"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            disabled
                                            value={username}
                                            id="username" name="username" label="Username (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.username = event.target.value; this.setState({ username: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength50', 'isNickname']}
                                            errorMessages={['Username không được bỏ trống!', 'Không cho phép nhập quá 50 kí tự!', 'Username không hợp lệ!']}
                                        /> :
                                        <TextValidator
                                            value={username}
                                            id="username" name="username" label="Username (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.username = event.target.value; this.setState({ username: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength50', 'isNickname']}
                                            errorMessages={['Username không được bỏ trống!', 'Không cho phép nhập quá 50 kí tự!', 'Username không hợp lệ!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ? '' :
                                        <TextValidator
                                            type="password"
                                            value={password} id="password" name="password" label="Mật khẩu (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.password = event.target.value; this.setState({ password: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'minPassword']}
                                            errorMessages={['Mật khẩu không được bỏ trống!', 'Mật khẩu dài ít nhất 8 kí tự!']}
                                        />}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            {
                                this.data != JSON.stringify(this.data2) && !this.state.modalSetPassword ?
                                    <Button variant="contained" color="primary" type="submit">Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            }
                            {
                                updateable && dataUser.user && dataUser.user.id ?
                                    <Button onClick={() => this.modalConfirmDialog()} variant="contained" color="secondary">{dataUser.user && dataUser.user.active ? 'Inactive' : 'Active'}</Button> : null
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {this.state.modalSetPassword && <SetPassword data={dataUser} callbackOff={this.closeModal.bind(this)} />}
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={dataUser.user.active ? "Bạn có muốn cập nhật trạng thái từ Active sang Inactive" : "Bạn có muốn cập nhật trạng thái từ Inactive sang Active"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.active.bind(this)} />}
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
        color: 'red',
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateAdmin));