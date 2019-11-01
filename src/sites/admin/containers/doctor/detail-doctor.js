import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import ModalUpdate from './create-update-doctor';
import { Link } from 'react-router-dom';
import userProvider from '../../../../data-access/user-provider';
import roleProvider from '../../../../data-access/role-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailDoctor extends React.Component {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 128).length > 0;
        let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 256).length > 0;
        let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 512).length > 0;
        let viewableUserAdmin = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 1).length > 0;

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
            gender: this.props.data && this.props.data.user && this.props.data.user.gender == 0 ? 0 : this.props.data.user.gender ? this.props.data.user.gender : this.props.gender[0].gender.id,
            specialist: this.props.data && this.props.data.specialist && this.props.data.specialist.name ? this.props.data.specialist.name : '',
            title: this.props.data && this.props.data.user && this.props.data.user.title ? this.props.data.user.title : this.props.title[0].title.id,
            degree: this.props.data && this.props.data.user && this.props.data.user.degree ? this.props.data.user.degree : this.props.degree[0].degree.id,
            password: this.props.data && this.props.data.user && this.props.data.user.password ? this.props.data.user.password : '',
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : '',
            note: this.props.data && this.props.data.user && this.props.data.user.note ? this.props.data.user.note : '',
            userCreate: this.props.data && this.props.data.userCreate ? this.props.data.userCreate : '',
            createdDate: this.props.data && this.props.data.user ? this.props.data.user.createdDate : '',
            userUpdate: this.props.data && this.props.data.userUpdate ? this.props.data.userUpdate : '',
            updatedDate: this.props.data && this.props.data.user ? this.props.data.user.updatedDate : '',
            modalUpdate: false,
            viewable,
            createable,
            updateable,
            viewableUserAdmin
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    modalUpdate(dataUser) {
        if (this.state.updateable){
            this.setState({
                modalUpdate: true,
                dataUser,
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
    }

    closeModal() {
        this.setState({ modalUpdate: false });
        this.handleClose();
    }

    detaiUserCreate() {
        this.props.history.push("/admin/mgr-admin")
    }

    handleLink(){
        if (this.state.viewableUserAdmin){

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
    }

    render() {
        const { classes } = this.props;
        const { dataUser, listGender, listTitle, listDegree, listSpecialist, avatar, name, certificateCode, phone, email, dob, gender, updateable, specialist, title, degree, password, address, note, userCreate, createdDate, userUpdate, updatedDate, viewableUserAdmin } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="md"
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Chi tiết tài khoản bác sĩ
                        <Button style={{ marginLeft: 20 }} variant="contained" color="secondary">{dataUser.user && dataUser.user.active ? 'Active' : 'Inactive'}</Button>
                        {
                            updateable ? 
                            <Button className="btn-popup-primary" style={{ float: "right" }} onClick={() => this.modalUpdate(dataUser)} variant="contained" color="inherit"><img src="/images/icon/edit-white.png" alt=""/> Chỉnh sửa</Button>:null
                            
                        }
                    </DialogTitle>
                    <DialogContent>
                        <Row style={{ marginLeft: 40 }}>
                            <Col xs="12" sm="3" md="3">
                                <div class="row mgbt-xs-0">
                                    <Avatar
                                        style={{ width: 100, height: 100 }} alt="Remy Sharp"
                                        src={avatar ? avatar.absoluteUrl() : "/avatar.png"}
                                        className={classNames(classes.avatar, classes.bigAvatar)} />
                                </div>
                            </Col>
                            <Col xs="12" sm="5" md="5">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Họ tên:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ width: "55%"}}>{name}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Chức vụ:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{title == 1 ? 'Giám đốc' : title == 2 ? 'Phó Giám đốc' : title == 3 ? 'Trưởng khoa' : title == 4 ? 'Phó trưởng khoa' : ''}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Email:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ wordBreak: "break-all", width: "55%" }}>{email}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Địa chỉ:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ width: '55%', textAlign: 'justify'}}>{address}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Số văn bằng chuyên môn:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{certificateCode}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="4" md="4">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Chuyên khoa:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{specialist}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>SĐT:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{phone}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày sinh:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{ dob ? moment(dob).format("DD-MM-YYYY") : null}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Giới tính:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{gender == 0 ? 'Nữ' : gender == 1 ? 'Nam' : gender == 2 ? 'Không xác định' : ''}</div>
                                </div>
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Học hàm học vị:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>
                                        {degree == 1 ? 'Giáo sư' : 
                                            degree == 2 ? 'Phó Giáo sư' : 
                                                degree == 3 ? 'Tiến sĩ' : 
                                                    degree == 4 ? 'Thạc sĩ' : 
                                                        degree == 5 ? 'Bác sĩ chuyên khoa II' : 
                                                            degree == 6 ? 'Bác sĩ chuyên khoa I' : 
                                                                degree == 7 ? 'Bác sĩ đa khoa' : ''}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="3" md="3"></Col>
                            <Col xs="12" sm="9" md="9">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabelNote}>Giới thiệu/Lý lịch tốt nghiệp:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ textAlign: 'justify', width: '60%', marginBottom: 13 }}>{note}</div>
                                </div>
                            </Col>
                            <div style={{ width: '100%', borderBottom: '1px solid', marginRight: 80 }}></div>
                            <Col xs="12" sm="3" md="3"></Col>
                            <Col xs="12" sm="4" md="5">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người tạo:</label>
                                    {
                                        viewableUserAdmin ? 
                                        <Link class="col-xs-7 controls" className={classes.controls} style={{ textDecoration: 'none', color: 'black' }} to={'/admin/mgr-admin?id=' + userCreate.id}>{userCreate.name}</Link> 
                                        : 
                                        <div class="col-xs-7 controls" className={classes.controls} onClick={() => this.handleLink()}>
                                            {userCreate.name}
                                        </div>
                                    }
                                </div>
                            </Col>
                            <Col xs="12" sm="4" md="4">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người cập nhật:</label>
                                    {
                                        viewableUserAdmin ? 
                                        <Link class="col-xs-7 controls" className={classes.controls} style={{ textDecoration: 'none', color: 'black' }} to={'/admin/mgr-admin?id=' + userUpdate.id}>{userUpdate.name}</Link>
                                        : 
                                        <div class="col-xs-7 controls" className={classes.controls} onClick={() => this.handleLink()}>
                                           {userUpdate.name}
                                        </div>
                                    }
                                </div>
                            </Col>
                            <Col xs="12" sm="3" md="3"></Col>
                            <Col xs="12" sm="5" md="5">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày tạo:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{moment(createdDate).format("DD-MM-YYYY HH:mm:ss")}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="4" md="4">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày cập nhật:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{moment(updatedDate).format("DD-MM-YYYY HH:mm:ss")}</div>
                                </div>
                            </Col>
                        </Row>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                    </DialogActions>
                </Dialog>
                {this.state.modalUpdate && <ModalUpdate data={dataUser} gender={listGender} title={listTitle} degree={listDegree} specialist={listSpecialist} callbackOff={this.closeModal.bind(this)} />}
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
        fontWeight: 'bold',
        width: 125,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }, controlLabelNote: {
        fontWeight: 'bold',
        width: 230,
        marginTop: 10,
        marginBottom: 20,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailDoctor));