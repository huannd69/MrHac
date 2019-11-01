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
import ConfirmDialog from '../../components/confirm/';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import ImageProvider from '../../../../data-access/image-provider';
import roleProvider from '../../../../data-access/role-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateDoctor extends React.Component {
    constructor(props) {
        super(props)
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 128).length > 0;
        let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 256).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 512).length > 0;

        this.state = {
            open: true,
            dataUser: this.props.data,
            listGender: this.props.gender,
            listTitle: this.props.title,
            listDegree: this.props.degree,
            listSpecialist: this.props.specialist,
            avatar: this.props.data && this.props.data.user && this.props.data.user.avatar ? this.props.data.user.avatar : '',
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            certificateCode: this.props.data && this.props.data.user && this.props.data.user.certificateCode ? this.props.data.user.certificateCode : '',
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : '',
            dob: this.props.data && this.props.data.user && this.props.data.user.dob ? this.props.data.user.dob : null,
            gender: this.props.data && this.props.data.user && this.props.data.user.gender == 0 ? 0 : this.props.data.user && this.props.data.user.gender ? this.props.data.user.gender : this.props.gender[0].gender.id,
            specialist: this.props.data && this.props.data.specialist && this.props.data.specialist.id ? this.props.data.specialist.id : this.props.specialist[0].specialist.id,
            title: this.props.data && this.props.data.user && this.props.data.user.title ? this.props.data.user.title : this.props.title[0].title.id,
            degree: this.props.data && this.props.data.user && this.props.data.user.degree ? this.props.data.user.degree : this.props.degree[0].degree.id,
            password: this.props.data && this.props.data.user && this.props.data.user.password ? this.props.data.user.password : '',
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : '',
            note: this.props.data && this.props.data.user && this.props.data.user.note ? this.props.data.user.note : '',
            hasErrorGender: false,
            hasErrorDegree: false,
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
            if (!value && value.length == 0) {
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
        ValidatorForm.addValidationRule('maxCertificateCode', (value) => {
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
        ValidatorForm.addValidationRule('chosseGender', (value) => {
            if (value == -1)
                return false
            return true
        });
        ValidatorForm.addValidationRule('chosseDegree', (value) => {
            if (value == -1)
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
            });
        }
    }

    create = () => {
        this.setState({ hasErrorGender: false, hasErrorDegree: false });
        const { dataUser, avatar, name, certificateCode, phone, email, dob, gender, specialist, title, degree, password, address, note } = this.state;
        let id = dataUser && dataUser.user ? dataUser.user.id : '';
        let param = {
            user: {
                avatar,
                name: name.trim(),
                certificateCode: certificateCode.trim(),
                phone,
                email,
                dob: dob ? moment(dob).format('YYYY-MM-DD 00:00:00') : null,
                gender,
                title,
                degree,
                password: md5(password),
                address: address.trim(),
                note: note.trim(),
                role: 2,
                active: 1,
            }, specialistId: specialist
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
                    case 4:
                        toast.error("Số văn bằng chuyên môn đã tồn tại trên hệ thống. Vui lòng sử dụng Số văn bằng chuyên môn khác!", {
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

    uploadAvatar = (event) => {
        if (event.target.files.length > 0) {
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
        const { hasErrorGender, hasErrorDegree, dataUser, listGender, listTitle, listDegree, listSpecialist, avatar, name, updateable, certificateCode, phone, email, dob, gender, specialist, title, degree, password, address, note } = this.state;

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
                            {dataUser.user && dataUser.user.id ? 'Cập nhật tài khoản bác sĩ ' : 'Tạo tài khoản bác sĩ'}
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
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            disabled
                                            value={name}
                                            id="name" name="name" label="Họ và tên (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength']}
                                            errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                        /> :
                                        <TextValidator
                                            value={name}
                                            id="name" name="name" label="Họ và tên (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength']}
                                            errorMessages={['Họ và tên không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            disabled
                                            value={certificateCode}
                                            id="certificateCode" name="certificateCode" label="Số văn bằng chuyên môn (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.certificateCode = event.target.value; this.setState({ certificateCode: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxCertificateCode']}
                                            errorMessages={['Số văn bằng chuyên môn không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!']}
                                        /> :
                                        <TextValidator
                                            value={certificateCode}
                                            id="certificateCode" name="certificateCode" label="Số văn bằng chuyên môn (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.certificateCode = event.target.value; this.setState({ certificateCode: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxCertificateCode']}
                                            errorMessages={['Số văn bằng chuyên môn không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            disabled
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
                                    <div style={{ marginBottom: '16px' }}></div>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={dob}
                                            label="Ngày sinh"
                                            maxDate={new Date()}
                                            onChange={(date) => { this.data2.dob = date; this.setState({ dob: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataUser.user && dataUser.user.id ?
                                        <TextValidator
                                            disabled
                                            value={email}
                                            id="email" name="email" label="Email (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.email = event.target.value; this.setState({ email: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'isEmail', 'maxLength']}
                                            errorMessages={['Email không được bỏ trống!', 'Email không hợp lệ!', 'Không cho phép nhập quá 255 kí tự!']}
                                        /> :
                                        <TextValidator
                                            value={email}
                                            id="email" name="email" label="Email (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.email = event.target.value; this.setState({ email: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'isEmail', 'maxLength']}
                                            errorMessages={['Email không được bỏ trống!', 'Email không hợp lệ!', 'Không cho phép nhập quá 255 kí tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.specialist == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Chuyên khoa</div>
                                    }
                                    <Select
                                        value={specialist}
                                        onChange={(event) => { this.data2.specialist = event.target.value; this.setState({ specialist: event.target.value }) }}
                                        inputProps={{ name: 'selectSpecialist', id: 'selectSpecialist' }}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listSpecialist && listSpecialist.length ? listSpecialist.map((option, index) =>
                                                <MenuItem key={index} value={option.specialist.id}>{option.specialist.name}</MenuItem>
                                            ) : null
                                        }
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.gender == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Giới tính</div>
                                    }
                                    <SelectValidator
                                        value={gender}
                                        onChange={(event) => { this.data2.gender = event.target.value; this.setState({ gender: event.target.value }) }}
                                        inputProps={{ name: 'selectGender', id: 'selectGender' }}
                                        validators={["chosseGender"]}
                                        errorMessages={["Vui lòng chọn giới tính!"]}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listGender && listGender.length ? listGender.map((option, index) =>
                                                <MenuItem key={index} value={option.gender.id}>{option.gender.name}</MenuItem>
                                            ) : null
                                        }
                                    </SelectValidator>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.title == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Chức vụ</div>
                                    }
                                    <Select
                                        value={title}
                                        onChange={(event) => { this.data2.title = event.target.value; this.setState({ title: event.target.value }) }}
                                        inputProps={{ name: 'selectTitle', id: 'selectTitle' }}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listTitle && listTitle.length ? listTitle.map((option, index) =>
                                                <MenuItem key={index} value={option.title.id}>{option.title.name}</MenuItem>
                                            ) : null
                                        }
                                    </Select>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div style={{ marginBottom: '25px' }}></div>
                                    {
                                        this.state.degree == -1 ? null : <div style={{ position: "absolute", marginTop: -10, fontSize: 13 }}>Học hàm học vị</div>
                                    }
                                    <SelectValidator
                                        value={degree}
                                        onChange={(event) => { this.data2.degree = event.target.value; this.setState({ degree: event.target.value }) }}
                                        inputProps={{ name: 'selectDegree', id: 'selectDegree' }}
                                        validators={["chosseDegree"]}
                                        errorMessages={["Vui lòng chọn học hàm học vị!"]}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listDegree && listDegree.length ? listDegree.map((option, index) =>
                                                <MenuItem key={index} value={option.degree.id}>{option.degree.name}</MenuItem>
                                            ) : null
                                        }
                                    </SelectValidator>
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
                                            errorMessages={['Mật khẩu không được bỏ trống!', 'Mật khẩu dài ít nhất 8 ký tự!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={address} id="address" label="Địa chỉ"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.address = event.target.value; this.setState({ address: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={note} id="note" label="Giới thiệu/Lý lịch nghề nghiệp"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.note = event.target.value; this.setState({ note: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 255 kí tự!']}
                                    />
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateDoctor));