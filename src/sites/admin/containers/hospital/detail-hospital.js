import React, { Component } from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateUtils from 'mainam-react-native-date-utils';
import { Link } from 'react-router-dom';
import EnhancedTableToolbar from '../../components/table-toolbar';
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalAddUpdate from './create-update-hospital';
import ModalDetailWallet from './detail-wallets';
import { Col, Row } from 'reactstrap';
import Slide from '@material-ui/core/Slide';
import { connect } from 'react-redux';
import userProvider from '../../../../data-access/user-provider';
import roleProvider from '../../../../data-access/role-provider';
import GoogleMapReact from 'google-map-react';
import DetailImage from './detail-image';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class DetaitHospital extends React.Component {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 65536).length > 0;
        let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 131072).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 262144).length > 0;
        let viewableWallet = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 33554432).length > 0;
        let viewableUserAdmin = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 1).length > 0;

        this.state = {
          open: true,
          dataHospital: this.props.data,
          name:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.name
              ? this.props.data.hospital.name
              : "",
          serviceUrl:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.serviceUrl
              ? this.props.data.hospital.serviceUrl
              : "",
          taxCode:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.taxCode
              ? this.props.data.hospital.taxCode
              : "",
          address:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.address
              ? this.props.data.hospital.address
              : "",
          createdDate:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.createdDate
              ? this.props.data.hospital.createdDate
              : "",
          updatedDate:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.updatedDate
              ? this.props.data.hospital.updatedDate
              : "",
          phone:
            this.props.data &&
            this.props.data.userAdmin &&
            this.props.data.userAdmin.phone
              ? this.props.data.userAdmin.phone
              : "",
          email:
            this.props.data &&
            this.props.data.userAdmin &&
            this.props.data.userAdmin.email
              ? this.props.data.userAdmin.email
              : "",
          username:
            this.props.data &&
            this.props.data.userAdmin &&
            this.props.data.userAdmin.username
              ? this.props.data.userAdmin.username
              : "",
          password:
            this.props.data &&
            this.props.data.userAdmin &&
            this.props.data.userAdmin.password
              ? this.props.data.userAdmin.password
              : "",
          zone:
            this.props.data &&
            this.props.data.zone &&
            this.props.data.zone.name
              ? this.props.data.zone.name
              : "",
          district:
            this.props.data &&
            this.props.data.district &&
            this.props.data.district.name
              ? this.props.data.district.name
              : "",
          province:
            this.props.data &&
            this.props.data.province &&
            this.props.data.province.countryCode
              ? this.props.data.province.countryCode
              : "",
          availableBooking:
            this.props.data &&
            this.props.data.availableBooking &&
            this.props.data.availableBooking
              ? this.props.data.availableBooking
              : 0,
          lat:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.lat
              ? this.props.data.hospital.lat
              : 21.00843,
          lon:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.lon
              ? this.props.data.hospital.lon
              : 105.80143,
          modalUpdate: false,
          modalDetailWallet: false,
          modalDetailImage: false,
          selected: [],
          viewable,
          createable,
          updateable,
          viewableWallet,
          viewableUserAdmin,
          listProvince: this.props.province,
          listDistrict: this.props.district,
          listZone: this.props.zone,
          images:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.images
              ? this.props.data.hospital.images
              : "",
          avatar:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.avatar
              ? this.props.data.hospital.avatar
              : "",
          logo:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.logo
              ? this.props.data.hospital.logo
              : "",
          imageHome:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.imageHome
              ? this.props.data.hospital.imageHome
              : ""
        };
    }

    closeModal() {
        this.setState({ modalDetailHospital: false, modalUpdate: false, modalDetailImage: false });
        this.handleClose();

    }

    componentDidMount() {
        setTimeout(() => {
            let map;
            let markers = [];
            map = new window.google.maps.Map(window.document.getElementById('map2'), {
                center: {
                    lat: this.props.data && this.props.data.hospital && this.props.data.hospital.lat ? this.props.data.hospital.lat : 21.008430,
                    lng: this.props.data && this.props.data.hospital && this.props.data.hospital.lon ? this.props.data.hospital.lon : 105.801430,
                },
                zoom: 14,
                mapTypeId: 'roadmap',
            });
            let marker = new window.google.maps.Marker({
                map: map,
                position: {
                    lat: this.props.data && this.props.data.hospital && this.props.data.hospital.lat ? this.props.data.hospital.lat : 21.008430,
                    lng: this.props.data && this.props.data.hospital && this.props.data.hospital.lon ? this.props.data.hospital.lon : 105.801430,
                },
            });
            markers = [marker];
            let addMarker = function (location) {
                deleteMarkers();
                let marker = new window.google.maps.Marker({
                    position: location,
                    map: map
                });
                if ((!map.getBounds().contains(marker.getPosition()))) {
                    map.setCenter(marker.getPosition());
                }
                markers.push(marker);
            };
            let deleteMarkers = function () {
                for (let i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];

            };

            map.addListener('zoom_changed', () => {
                this.setState({
                    zoom: map.getZoom(),
                });
            });
        }, 1000);
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    modalUpdate(dataHospital) {
        if (this.state.updateable) {
            this.setState({
                modalUpdate: true,
                dataHospital,
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    modalDetailWallet(dataHospital) {
        if (this.state.viewable) {
            this.setState({
                modalDetailWallet: true,
                dataHospital,
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    handleLink() {
        if (this.state.viewableWallet) {

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    handleLinkUserAdmin() {
        if (this.state.viewableUserAdmin) {

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    static defaultProps = {
        center: {
            lat: 21.008430,
            lng: 105.801430
        },
        zoom: 7
    };

    modalDetailImage(item) {
        this.setState({
            dataImages: item,
            modalDetailImage: true
        })
    }


    render() {
        const { classes } = this.props;
        const {
          name,
          taxCode,
          createdDate,
          dataHospital,
          phone,
          email,
          username,
          lat,
          lon,
          dataImages,
          address,
          zone,
          district,
          province,
          availableBooking, 
          images,
          avatar,
          logo,
          imageHome,
          listProvince,
          listDistrict,
          listZone,
          updatedDate,
          serviceUrl,
          viewableWallet,
          viewableUserAdmin,
          updateable
        } = this.state;
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
                        Chi tiết Cơ sở y tế
                            <Button style={{ marginLeft: 20 }} variant="contained" color="secondary">{dataHospital.hospital && dataHospital.hospital.active ? 'Active' : 'Inactive'}</Button>
                        {
                            updateable ?
                                <Button className="btn-popup-primary" style={{ float: "right" }} onClick={() => this.modalUpdate(dataHospital)} variant="contained" color="inherit"> <img src="/images/icon/edit-white.png" alt="" /> Chỉnh sửa</Button>
                                : null
                        }
                    </DialogTitle>
                    <DialogContent>
                        <Row style={{ marginLeft: 40 }}>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Tên CSYT:</Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left", width: '69%' }} className={classes.controls}>{name}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Mã số thuế:</Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>{taxCode}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Email: </Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left", width: '69%' }} className={classes.controls}>{email}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>SĐT:</Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>{phone}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Username:</Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left", width: '69%' }} className={classes.controls}>{username}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Tài khoản ví: </Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>
                                        {dataHospital.hospital.activeWallet ? "Đã kích hoạt" : "Chưa kích hoạt"}
                                    </Col>

                                </div>
                            </Col>
                            <Col xs="6" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Url:</Col>
                                    {/* <Link class="controls hospital-url" className={classes.controls}
                                        to={'/' + serviceUrl}>{serviceUrl}</Link> */}
                                    <a class="controls" xs="12" sm="10" md="10" href={serviceUrl.startsWith("http") ? serviceUrl : "http://" + serviceUrl} target="_blank" style={{ textAlign: "left", marginLeft: '2.5%', textDecoration: "underline", width: '80%' }} className={classes.controls}>{serviceUrl}</a>
                                </div>
                            </Col>

                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Chi tiết: </Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>
                                        {
                                            dataHospital.hospital.activeWallet ?
                                                <span >

                                                    {
                                                        viewableWallet ?
                                                            <Link class="controls" className={classes.controls}
                                                                to={'/admin/wallets-hospital/' + dataHospital.hospital.id}>Xem chi tiết ví</Link>
                                                            : null
                                                        // <div class="controls" xs="12" sm="10" md="10" className={classes.controls}
                                                        //     style={{ textDecoration: 'none', color: 'black', textAlign: "left", marginLeft: 10 }} onClick={() => this.handleLink()}>
                                                        //     Chi tiết
                                                        // </div>
                                                    }
                                                </span>
                                                : null
                                        }
                                    </Col>

                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Logo:</Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left" }} className={classes.controls}>
                                        <img
                                            style={{ height: 100 }} alt=""
                                            onClick={() => this.modalDetailImage(avatar)}
                                            src={avatar ? avatar.absoluteUrl() : ""}
                                        />
                                    </Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Logo header:</Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>
                                        <img
                                            style={{ height: 100 }} alt=""
                                            onClick={() => this.modalDetailImage(images)}
                                            src={images ? images.absoluteUrl() : ""}
                                        />
                                    </Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Avatar:</Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left" }} className={classes.controls}>
                                        <img
                                            style={{ height: 100 }} alt=""
                                            onClick={() => this.modalDetailImage(logo)}
                                            src={logo ? logo.absoluteUrl() : ""}
                                        />
                                    </Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Ảnh hiển thị:</Col>
                                    <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left", marginLeft: -35 }} className={classes.controls}>
                                        <img
                                            style={{ height: 100 }} alt=""
                                            onClick={() => this.modalDetailImage(imageHome)}
                                            src={imageHome ? imageHome.absoluteUrl() : ""}
                                        />
                                    </Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="1" md="1" style={{ textAlign: "left" }} className={classes.controlLabel}>Địa chỉ:</Col>
                                    <Col class="controls" xs="12" sm="11" md="11" style={{ textAlign: "left", width: '80%' }} className={classes.controls}>{address}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="1" md="1" style={{ textAlign: "left" }} className={classes.controlLabel}>Cho phép đặt khám:</Col>
                                    <Col class="controls" xs="12" sm="11" md="11" style={{ textAlign: "left", width: '80%' }} className={classes.controls}>{availableBooking === 1 ? 'Có' : 'Không'}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div style={{ marginBottom: 18, marginTop: 5 }}>Vị trí bản đồ:</div>
                                <div id='app'>
                                    <div id='map2' style={{ width: '100%', height: 350 }} />
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12" style={{ width: '100%', borderBottom: '1px solid', marginRight: 80, marginTop: 10, marginBottom: 10 }}></Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Người tạo:</Col>
                                    {
                                        dataHospital.createdPerson ?
                                            <div>
                                                {
                                                    viewableUserAdmin ?
                                                        <Link class="controls" xs="12" sm="10" md="10" className={classes.controls}
                                                            style={{ textDecoration: 'none', color: 'black', textAlign: "left", marginLeft: 16 }}
                                                            to={'/admin/mgr-admin?id=' + dataHospital.createdPerson.id}>{dataHospital.createdPerson.name}</Link>
                                                        :
                                                        <div class="controls" xs="12" sm="10" md="10" className={classes.controls}
                                                            style={{ textDecoration: 'none', color: 'black', textAlign: "left", marginLeft: 16 }}
                                                            onClick={() => this.handleLinkUserAdmin()}>
                                                            {dataHospital.createdPerson.name}
                                                        </div>
                                                }
                                            </div>
                                            : null
                                    }
                                    {/* <div class="col-xs-7 controls" className={classes.controls}>{userCreate}</div> */}
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Người cập nhật:</Col>
                                    {
                                        dataHospital.updatedPerson ?
                                            <div>
                                                {
                                                    viewableUserAdmin ?
                                                        <Link class="controls" xs="12" sm="10" md="10" className={classes.controls}
                                                            style={{ textDecoration: 'none', color: 'black', marginLeft: 16, textAlign: "left" }}
                                                            to={'/admin/mgr-admin?id=' + dataHospital.updatedPerson.id}>
                                                            {dataHospital.updatedPerson.name}
                                                        </Link>
                                                        :
                                                        <div class="controls" xs="12" sm="10" md="10" className={classes.controls}
                                                            style={{ textDecoration: 'none', color: 'black', textAlign: "left", marginLeft: 16 }}
                                                            onClick={() => this.handleLinkUserAdmin()}>
                                                            {dataHospital.updatedPerson.name}
                                                        </div>
                                                }
                                            </div>
                                            : null
                                    }
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="2" md="2" style={{ textAlign: "left" }} className={classes.controlLabel}>Ngày tạo:</Col>
                                    <Col class="controls" xs="12" sm="10" md="10" style={{ textAlign: "left" }} className={classes.controls}>{moment(createdDate).format("DD-MM-YYYY HH:mm:ss")}</Col>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0" style={{ marginBottom: 5, marginTop: 5 }}>
                                    <Col class="control-label" xs="12" sm="3" md="3" style={{ textAlign: "left" }} className={classes.controlLabel}>Ngày cập nhật:</Col>
                                    {
                                        dataHospital.hospital ?
                                            <Col class="controls" xs="12" sm="9" md="9" style={{ textAlign: "left" }} className={classes.controls}>{moment(dataHospital.hospital.updatedDate).format("DD-MM-YYYY HH:mm:ss")}</Col>
                                            : null
                                    }

                                </div>
                            </Col>
                        </Row>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                    </DialogActions>
                </Dialog>
                {this.state.modalUpdate && <ModalAddUpdate data={dataHospital} province={listProvince} district={listDistrict} zone={listZone} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetailWallet && <ModalDetailWallet data={dataHospital} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetailImage && <DetailImage data={dataImages} callbackOff={this.closeModal.bind(this)} />}
            </div >
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    }, contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    }
});

DetaitHospital.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(DetaitHospital));