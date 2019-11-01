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
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import ConfirmDialog from '../../components/confirm/';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import ImageProvider from '../../../../data-access/image-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateUser extends React.Component {
    constructor(props) {
        super(props)
        let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 16).length > 0;
        let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 32).length > 0;
        let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 64).length > 0;

        this.state = {
            open: true,
            dataUser: this.props.data,
            listGender: this.props.gender,
            avatar: this.props.data && this.props.data.user && this.props.data.user.avatar ? this.props.data.user.avatar : '',
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            gender: this.props.data && this.props.data.user && this.props.data.user.gender ? this.props.data.user.gender : this.props.gender[0].gender.id,
            dob: this.props.data && this.props.data.user && this.props.data.user.dob ? this.props.data.user.dob : new Date(),
            passport: this.props.data && this.props.data.user && this.props.data.user.passport ? this.props.data.user.passport : '',
            dateRangePassPort: this.props.data && this.props.data.user && this.props.data.user.dateRangePassPort ? this.props.data.user.dateRangePassPort : new Date(),
            placePassPort: this.props.data && this.props.data.user && this.props.data.user.placePassPort ? this.props.data.user.placePassPort : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : '',
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : '',
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : '',
            password: this.props.data && this.props.data.user && this.props.data.user.password ? this.props.data.user.password : '',
            confirmDialog: false,
            viewable,
            createable,
            updateable,
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
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
        ValidatorForm.addValidationRule('maxPassport', (value) => {
            if (value.length > 20)
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
    }

    handleClose = () => {
        this.props.callbackOff()
    };

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

    create = () => {
        const { dataUser, avatar, name, gender, dob, passport, dateRangePassPort, placePassPort, email, phone, address, password } = this.state;
        let id = dataUser && dataUser.user ? dataUser.user.id : '';
        let param = {
            user: {
                // avatar,
                name: name.trim(),
                gender,
                dob: moment(dob).format('YYYY-MM-DD 00:00:00'),
                // passport: passport.trim(),
                // dateRangePassPort: moment(dateRangePassPort).format('YYYY-MM-DD 00:00:00'),
                // placePassPort: placePassPort.trim(),
                email,
                phone,
                address: address.trim(),
                // password: md5(password),
                // role: 1,
                // active: 1,
            },
        }
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
                    default:
                        toast.success("Tạo mới tài khoản không thành công!", {
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

    uploadAvatar = (event) => {
        ImageProvider.upload(event.target.files[0]).then(s => {
            if (s && s.data && s.data.code == 0) {
                this.data2.avatar = s.data.data.images[0].image;
                this.setState({
                    avatar: s.data.data.images[0].image,
                });
            }
        }).catch(e => {
            toast.error("Vui lòng thử lại !", {
                position: toast.POSITION.TOP_LEFT
            });
        })

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
        const { dataUser, listGender, avatar, name, gender, dob, passport, dateRangePassPort, placePassPort, email, phone, address, password, updateable } = this.state;

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
                            {dataUser.user && dataUser.user.id ? 'Cập nhật tài khoản' : 'Tạo tài khoản bệnh nhân'}
                        </DialogTitle>
                        <DialogContent>
                            <div style={{ textAlign: 'center' }}>
                                <input
                                    accept="image/png"
                                    className={classes.input}
                                    style={{ display: 'none' }}
                                    id="upload_avatar"
                                    onChange={this.uploadAvatar}
                                    type="file"
                                />
                                <label htmlFor="upload_avatar">
                                    <Button component="span" style={{ width: 100, height: 100, padding: 0, borderRadius: 100 }}>
                                        <Avatar
                                            style={{ width: 100, height: 100, margin: 'auto' }} alt="Remy Sharp"
                                            src={avatar ? avatar.absoluteUrl() : "/avatar.png"}
                                            className={classNames(classes.avatar, classes.bigAvatar)} />
                                    </Button>
                                </label>
                            </div>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6}>
                                { dataUser.user && dataUser.user.id ?
                                    <TextValidator
                                        
                                        value={name}
                                        id="name" name="name" label="Họ và tên (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    /> :
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Họ và tên (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                }
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.gender == -1 ? null : <div style={{ position: "absolute", top: 200, fontSize: 12, color: "darkgray" }}>Giới tính</div>
                                    }
                                    <Select
                                        
                                        value={gender}
                                        onChange={(event) => { this.data2.gender = event.target.value; this.setState({ gender: event.target.value }) }}
                                        inputProps={{ name: 'selectGender', id: 'selectGender' }}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listGender.map((option, index) =>
                                                <MenuItem key={index} value={option.gender.id}>{option.gender.name}</MenuItem>
                                            )
                                        }
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '16px' }}></div>
                                    { dataUser.user && dataUser.user.id ? 
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            
                                            value={dob}
                                            label="Ngày sinh"
                                            onChange={(date) => { this.data2.dob = date; this.setState({ dob: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%' }}
                                        />
                                    </MuiPickersUtilsProvider>: 
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={dob}
                                            label="Ngày sinh"
                                            onChange={(date) => { this.data2.dob = date; this.setState({ dob: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    }
                                </Grid>
                                <Grid item xs={12} md={6}>
                                { dataUser.user && dataUser.user.id ? 
                                    <TextValidator
                                        disabled
                                        value={passport}
                                        id="filled-passport"
                                        label="Số giấy tờ tùy thân"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.passport = event.target.value; this.setState({ passport: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxPassport']}
                                        errorMessages={['Không cho phép nhập quá 20 kí tự!']}
                                    />:
                                    <TextValidator
                                        value={passport}
                                        id="filled-passport"
                                        label="Số giấy tờ tùy thân"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.passport = event.target.value; this.setState({ passport: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxPassport']}
                                        errorMessages={['Không cho phép nhập quá 20 kí tự!']}
                                    />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '16px' }}></div>
                                    { dataUser.user && dataUser.user.id ? 
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            disabled
                                            value={dateRangePassPort}
                                            label="Ngày cấp giấy tờ tùy thân"
                                            onChange={(date) => { this.data2.dateRangePassPort = date; this.setState({ dateRangePassPort: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%' }}
                                        />
                                    </MuiPickersUtilsProvider>:
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={dateRangePassPort}
                                            label="Ngày cấp giấy tờ tùy thân"
                                            onChange={(date) => { this.data2.dateRangePassPort = date; this.setState({ dateRangePassPort: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%' }}
                                        />
                                    </MuiPickersUtilsProvider>}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                 { dataUser.user && dataUser.user.id ? 
                                    <TextValidator
                                        disabled
                                        value={placePassPort}
                                        id="filled-place-pass-port"
                                        label="Nơi cấp giấy tờ tùy thân"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.placePassPort = event.target.value; this.setState({ placePassPort: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                    />: 
                                    <TextValidator
                                        value={placePassPort}
                                        id="filled-place-pass-port"
                                        label="Nơi cấp giấy tờ tùy thân"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.placePassPort = event.target.value; this.setState({ placePassPort: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                    />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            
                                            value={phone}
                                            id="phone" name="phone" label="Số điện thoại (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.phone = event.target.value; this.setState({ phone: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxPhone', 'isPhone']}
                                            errorMessages={['Số điện thoại không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!', 'Số điện thoại không hợp lệ! ']}
                                        /> :
                                        <TextValidator
                                            value={phone}
                                            id="phone" name="phone" label="Số điện thoại (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.phone = event.target.value; this.setState({ phone: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxPhone', 'isPhone']}
                                            errorMessages={['Số điện thoại không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!', 'Số điện thoại không hợp lệ! ']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            
                                            value={email}
                                            id="email" name="email" label="Email (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.email = event.target.value; this.setState({ email: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'isEmail', 'maxLength']}
                                            errorMessages={['Emai không được bỏ trống!', 'Email không hợp lệ!', 'Không cho phép nhập quá 255 kí tự!']}
                                        /> : <TextValidator
                                            type="password"
                                            value={password} id="password" name="password" label="Mật khẩu (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.password = event.target.value; this.setState({ password: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'minPassword']}
                                            errorMessages={['Mật khẩu không được bỏ trống!', 'Nhập ít nhất 8 kí tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                        
                                            value={address}
                                            id="filled-address"
                                            label="Địa chỉ"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }) }}
                                            margin="normal"
                                            validators={['maxLength']}
                                            errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                        /> : 
                                        <TextValidator
                                            value={address}
                                            id="filled-address"
                                            label="Địa chỉ"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }) }}
                                            margin="normal"
                                            validators={['maxLength']}
                                            errorMessages={['Không cho phép nhập quá 255 kí tự!']}
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
                                updateable && dataUser.user && dataUser.user.id ?
                                    <Button onClick={() => this.modalConfirmDialog()} variant="contained" color="secondary">{dataUser.user && dataUser.user.active ? 'Inactive' : 'Active'}</Button> : null
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
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
        color: 'red'
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateUser));