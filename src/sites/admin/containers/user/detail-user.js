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
import userProvider from '../../../../data-access/user-provider';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import ModalUpdate from './create-update-user';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import EnhancedTableToolbar from '../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import DetailImage from './detail-image';
import IconButton from '@material-ui/core/IconButton';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import medicalRecordProvider from '../../../../data-access/medical-record-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailUser extends React.Component {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 16).length > 0;
        let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 32).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 64).length > 0;
        let viewableUserAdmin = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 1).length > 0;
        let viewableWallet = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 33554432).length > 0;

        this.state = {
            open: true,
            dataUser: this.props.data,
            listGender: this.props.gender,
            avatar: this.props.data && this.props.data.user && this.props.data.user.avatar ? this.props.data.user.avatar : '',
            name: this.props.data && this.props.data.user && this.props.data.user.name ? this.props.data.user.name : '',
            userId: this.props.data && this.props.data.user && this.props.data.user.id ? this.props.data.user.id : '',
            gender: this.props.data && this.props.data.user && this.props.data.user.gender == 0 ? 0 : this.props.data.user.gender ? this.props.data.user.gender : this.props.gender[0].gender.id,
            dob: this.props.data && this.props.data.user && this.props.data.user.dob ? this.props.data.user.dob : '',
            email: this.props.data && this.props.data.user && this.props.data.user.email ? this.props.data.user.email : '',
            phone: this.props.data && this.props.data.user && this.props.data.user.phone ? this.props.data.user.phone : '',
            passport: this.props.data && this.props.data.user && this.props.data.user.passport ? this.props.data.user.passport : '',
            dateRangePassPort: this.props.data && this.props.data.user && this.props.data.user.dateRangePassPort ? this.props.data.user.dateRangePassPort : '',
            placePassPort: this.props.data && this.props.data.user && this.props.data.user.placePassPort ? this.props.data.user.placePassPort : '',
            address: this.props.data && this.props.data.user && this.props.data.user.address ? this.props.data.user.address : '',
            username: this.props.data && this.props.data.user && this.props.data.user.username ? this.props.data.user.username : '',
            userCreate: this.props.data && this.props.data.userCreate ? this.props.data.userCreate : '',
            createdDate: this.props.data && this.props.data.user && this.props.data.user.createdDate ? this.props.data.user.createdDate : '',
            userUpdate: this.props.data && this.props.data.userUpdate ? this.props.data.userUpdate : '',
            updatedDate: this.props.data && this.props.data.user && this.props.data.user.updatedDate ? this.props.data.user.updatedDate : '',
            modalUpdate: false,
            viewable,
            createable,
            updateable,
            viewableUserAdmin,
            viewableWallet,
            progress: false,
            dataProfile: [],
            images: [],
            listImages: [],
            modalDetailImage: false,
            listName: [],
            listEmail: [],
            type: 1
        };
    }

    componentWillMount() {
        this.getdetailUser();

    }

    handleClose = () => {
        this.props.callbackOff()
    };

    modalUpdate(dataUser) {
        if (this.state.updateable) {
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

    handleCheckUserAdmin() {
        if (this.state.viewableUserAdmin) {

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    closeModal() {
        this.setState({ modalUpdate: false, modalDetailImage: false });
        // this.handleClose();
    }

    listImages(item) {
        if (item.image) {
            let listImages = item.image.split(',');
            this.setState({
                images: listImages
            })
        }
    }

    getdetailUser() {
        let id = this.state.dataUser.user.id;
        medicalRecordProvider.getListByUser(id).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    dataProfile: s.data,
                })
                console.log(s.data);

            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    modalDetailImage(item) {
        this.setState({
            images: item,
            modalDetailImage: true
        })
    }

    checkNameIncrease() {
        const { dataProfile } = this.state;
        var sort = dataProfile.sort((itemA, itemB) => {
            const genreA = (itemA.medicalRecords.name || "").toUpperCase();
            const genreB = (itemB.medicalRecords.name || "").toUpperCase();
            let comparison = 0;
            if (genreA > genreB) {
                comparison = 1;
            } else if (genreA < genreB) {
                comparison = -1;
            };
            return comparison;
        });
        this.setState({
            dataProfile: sort,
            type: 2
        })
    }

    checkNameReduction() {
        const { dataProfile } = this.state;
        var sort = dataProfile.sort((itemA, itemB) => {
            const genreA = (itemA.medicalRecords.name || "").toUpperCase();
            const genreB = (itemB.medicalRecords.name || "").toUpperCase();
            let comparison = 0;
            if (genreA < genreB) {
                comparison = 1;
            } else if (genreA > genreB) {
                comparison = -1;
            };
            return comparison;
        });
        this.setState({
            dataProfile: sort,
            type: 1
        })
    }

    checkEmailIncrease() {
        const { dataProfile } = this.state;
        var sort = dataProfile.sort((itemA, itemB) => {
            const genreA = (itemA.medicalRecords.mail || "").toUpperCase();
            const genreB = (itemB.medicalRecords.mail || "").toUpperCase();
            let comparison = 0;
            if (genreA > genreB) {
                comparison = 1;
            } else if (genreA < genreB) {
                comparison = -1;
            };
            return comparison;
        });
        this.setState({
            dataProfile: sort,
            type: 2
        })
    }

    checkEmailReduction() {
        const { dataProfile } = this.state;
        var sort = dataProfile.sort((itemA, itemB) => {
            const genreA = (itemA.medicalRecords.mail || "").toUpperCase();
            const genreB = (itemB.medicalRecords.mail || "").toUpperCase();
            let comparison = 0;
            if (genreA < genreB) {
                comparison = 1;
            } else if (genreA > genreB) {
                comparison = -1;
            };
            return comparison;
        });
        this.setState({
            dataProfile: sort,
            type: 1
        })
    }

    sortName(type) {
        if (type == 1) {
            this.checkNameIncrease();
        } else if (type == 2) {
            this.checkNameReduction();
        } else {
            this.checkNameIncrease()
        }
    }

    sortEmail(type) {
        if (type == 1) {
            this.checkEmailIncrease();
        } else if (type == 2) {
            this.checkEmailReduction();
        } else {
            this.checkEmailIncrease()
        }
    }

    render() {
        const { classes } = this.props;
        const { dataUser, listGender, images, avatar, userId, name, gender, dob, email, phone, passport, dateRangePassPort, viewableWallet, placePassPort, updateable, address, username, userCreate, createdDate, userUpdate, updatedDate, viewableUserAdmin, progress, dataProfile } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    className="popup-detail-user"
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="md"
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Chi tiết tài khoản bệnh nhân
                        <Button style={{ marginLeft: 20 }} variant="contained" color="secondary">{dataUser.user && dataUser.user.active ? 'Active' : 'Inactive'}</Button>
                        {
                            updateable ?
                                <Button className="btn-popup-primary" style={{ float: "right" }} onClick={() => this.modalUpdate(dataUser)} variant="contained" color="inherit"><img src="/images/icon/edit-white.png" alt="" /> Chỉnh sửa</Button>
                                : null
                        }
                        <Button className="btn-popup-primary" style={{ float: "right", marginRight: 10 }} onClick={this.handleClose} variant="contained" color="inherit">Y bạ điện tử</Button>
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner content-detail-user">
                            <div className="row">
                                <div className="col-md-2" style={{ textAlign: 'center' }}>
                                    {
                                        avatar ?
                                            <Avatar
                                                style={{ width: 75, height: 75 }} alt="Remy Sharp"
                                                src={avatar.absoluteUrl()}
                                                className={classNames(classes.avatar, classes.bigAvatar)} /> :
                                            <img style={{ width: 75, height: 75 }} src="/avatar.png" />
                                    }

                                </div>
                                <div className="col-md-10">
                                    <div className="group-detail">
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Họ Tên:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Thông tin ví:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ color: "#329627", fontWeight: "bold" }}>Đã kích hoạt</p>
                                                        {/* <p className="content-detail">Chưa kích hoạt</p> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Giới tính:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{gender == 0 ? 'Nữ' : gender == 1 ? 'Nam' : gender == 2 ? 'Không xác định' : ''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Chi tiết:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {
                                                                viewableWallet ?
                                                                    <Link to={'/admin/wallets-hospital/'}>Xem chi tiết ví</Link> : null
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Email:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">{email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày sinh:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {dob && moment(dob).format("DD-MM-YYYY")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số CMND:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {passport}
                                                        </p>
                                                        <span className="blur-text">Ngày cấp: {dateRangePassPort && moment(dateRangePassPort).format("DD-MM-YYYY")}
                                                        </span><br />
                                                        <span className="blur-text">Nơi cấp: {placePassPort}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Số điện thoại:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Địa chỉ:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {address}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group-detail">
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Người tạo:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {
                                                                viewableUserAdmin ?
                                                                    <Link className={classes.controls}
                                                                        style={{ textDecoration: 'underline', }}
                                                                        to={'/admin/mgr-admin?id=' + userCreate.id}>{userCreate.name}</Link> :
                                                                    <div className={classes.controls}
                                                                        style={{ textDecoration: 'underline' }} onClick={() => this.handleCheckUserAdmin()}>
                                                                        {userCreate.name}
                                                                    </div>
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày tạo:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {moment(createdDate).format("DD-MM-YYYY HH:mm:ss")}
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Người cập nhật:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail" style={{ marginTop: -9 }}>
                                                            {
                                                                viewableUserAdmin && userId != userUpdate.id ?
                                                                    <Link className={classes.controls}
                                                                        style={{ textDecoration: 'none' }}
                                                                        to={'/admin/mgr-admin?id=' + userUpdate.id}>{userUpdate.name}</Link> :
                                                                    <div className={classes.controls}
                                                                        style={{ textDecoration: 'none' }} onClick={() => this.handleCheckUserAdmin()}>
                                                                        {userUpdate.name}
                                                                    </div>
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <div className="row">
                                                    <div className="col-md-5">
                                                        <span className="label-detail">Ngày cập nhật:</span>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <p className="content-detail">
                                                            {moment(updatedDate).format("DD-MM-YYYY HH:mm:ss")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-group">
                                        <Col xs="12" sm="12" md="12">
                                            {/* <div className={classes.tableWrapper}> */}
                                            <EnhancedTableToolbar
                                                title="Hồ sơ"
                                            />
                                            {progress ? <LinearProgress /> : null}
                                            {/* <DialogContent> */}
                                            <div className="list-doctor">
                                                <table>
                                                    <tr>
                                                        <td style={{ width: "10%" }}>STT</td>
                                                        <td style={{ width: "22%" }}>Họ và tên
                                            <IconButton onClick={() => this.sortName(this.state.type)} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                                <SortByAlphaIcon />
                                                            </IconButton></td>
                                                        <td style={{ width: "15%" }}>Giới tính</td>
                                                        <td style={{ width: "17%" }}>Ngày sinh</td>
                                                        <td style={{ width: "24%" }}>Số điện thoại
                                            {/* <IconButton onClick={() => this.sortEmail(this.state.type)} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                                <SortByAlphaIcon />
                                                            </IconButton> */}
                                                        </td>
                                                        <td style={{ width: "12%" }}>Ảnh</td>
                                                    </tr>
                                                    {
                                                        dataProfile && dataProfile.length ? dataProfile.map((item, index) => {
                                                            return (
                                                                <tr
                                                                    hover
                                                                    key={index}
                                                                    tabIndex={-1}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.medicalRecords.name}</td>
                                                                    <td>{item.medicalRecords.gender == 0 ? 'Nữ' : item.medicalRecords.gender == 1 ? 'Nam' : item.medicalRecords.gender == 2 ? 'Không xác định' : ''}</td>
                                                                    <td>{moment((item.medicalRecords.dob) || {}).format("DD/MM/YYYY")}</td>
                                                                    <td>{item.medicalRecords.phone}</td>
                                                                    {
                                                                        item.medicalRecords.avatar ?
                                                                            <td onClick={() => this.modalDetailImage(item.medicalRecords)} style={{ textDecoration: "underline" }}>Ảnh</td> :
                                                                            <td></td>
                                                                    }
                                                                </tr>
                                                            );
                                                        })
                                                            :
                                                            <tr>
                                                                {/* <TableCell>{this.state.permission.name ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell> */}
                                                            </tr>
                                                    }
                                                </table>
                                            </div>
                                        </Col>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                    </DialogActions>
                </Dialog>
                {this.state.modalUpdate && <ModalUpdate data={dataUser} gender={listGender} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetailImage && <DetailImage data={images} callbackOff={this.closeModal.bind(this)} />}
            </div>
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
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }, labelAvatar: {
        fontWeight: 'bold',
        width: 100,
        marginTop: 7,
    }, controlsAvatar: {
        marginTop: 7,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailUser));