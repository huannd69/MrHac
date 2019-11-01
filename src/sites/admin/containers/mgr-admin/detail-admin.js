import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import ModalUpdate from './create-update-admin';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailAdmin extends React.Component {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 1).length > 0;
        let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 2).length > 0;
        let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 4).length > 0;

        this.state = {
            open: true,
            dataUser: this.props.data,
            listRole: this.props.role,
            name: this.props.data && this.props.data.user ? this.props.data.user.name : '',
            // gender: this.props.data && this.props.data.user && this.props.data.user.gender == 0 ? 0 : this.props.data.user.gender ? this.props.data.user.gender : this.props.gender[0].gender.id,
            role: this.props.data.role && this.props.data.role.name ? this.props.data.role.name : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : '',
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : '',
            address: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.address : '',
            username: this.props.data && this.props.data.user && this.props.data.user.username ? this.props.data.user.username : '',
            userCreate: this.props.data && this.props.data.userCreate && this.props.data.userCreate ? this.props.data.userCreate : '',
            createdDate: this.props.data && this.props.data.user && this.props.data.user.createdDate ? this.props.data.user.createdDate : '',
            userUpdate: this.props.data && this.props.data.userUpdate && this.props.data.userUpdate ? this.props.data.userUpdate : '',
            updatedDate: this.props.data && this.props.data.user && this.props.data.user.updatedDate ? this.props.data.user.updatedDate : '',
            modalUpdate: false,
            viewable,
            createable,
            updateable,
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

    changeAdmin(item) {
        // userProvider.getDetail(item.id).then(s => {
        //     if (s && s.code == 0 && s.data) {
        //         this.setState({
        //             name: s.data && s.data.user ? s.data.user.name : '',
        //             gender: s.data && s.data.user ? s.data.user.gender : '',
        //             role: s.data && s.data.role ? s.data.role.name : '',
        //             email: s.data && s.data.user ? s.data.user.email : '',
        //             phone: s.data && s.data.user ? s.data.user.phone : '',
        //             address: s.data && s.data.user ? s.data.user.address : '',
        //             username: s.data && s.data.user ? s.data.user.username : '',
        //             userCreate: s.data && s.data.userCreate ? s.data.userCreate : '',
        //             createdDate: s.data && s.data.user ? s.data.user.createdDate : '',
        //             userUpdate: s.data && s.data.userUpdate ? s.data.userUpdate : '',
        //             updatedDate: s.data && s.data.user ? s.data.user.updatedDate : '',
        //         })
        //     }
        // }).catch(e => {
        // })
    }

    render() {
        const { classes } = this.props;
        const { dataUser, listRole, name, gender, role, email, phone, address, username, userCreate, createdDate, userUpdate, updateable, updatedDate } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="lg"
                    maxWidth="lg"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Chi tiết tài khoản nhân viên
                        <Button style={{ marginLeft: 20 }} variant="contained" color="secondary">{dataUser.user && dataUser.user.active ? 'Active' : 'Inactive'}</Button>
                        {
                            updateable ? 
                            <Button className="btn-popup-primary" style={{ float: "right" }}   onClick={() => this.modalUpdate(dataUser)}  variant="contained" color="inherit"><img src="/images/icon/edit-white.png" alt=""/> Sửa thông tin</Button>:null
                            
                        }
                    </DialogTitle>
                    <DialogContent>
                        <Row style={{ marginLeft: 40 }}>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Họ tên:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ width: "69%"}}>{name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Role:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{role}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Email:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ wordBreak: "break-all", width: "69%"}}>{email}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Số điện thoại:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{phone}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Username:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{username}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Địa chỉ:</label>
                                    <div class="col-xs-7 controls" className={classes.controls} style={{ textAlign: 'justify', wordBreak: 'break-all', width: '80%'}}>{address}</div>
                                </div>
                            </Col>
                            <div style={{ width: '100%', borderBottom: '1px solid', marginRight: 80 }}></div>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người tạo:</label>
                                    <div class="col-xs-7 controls" onClick={() => this.changeAdmin(userCreate)} className={classes.controls}>{userCreate.name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người cập nhật:</label>
                                    <div class="col-xs-7 controls" onClick={() => this.changeAdmin(userUpdate)} className={classes.controls}>{userUpdate.name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày tạo:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{moment(createdDate).format("DD-MM-YYYY HH:mm:ss")}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
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
                {this.state.modalUpdate && <ModalUpdate data={dataUser} role={listRole} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(DetailAdmin));