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
import MomentUtils from '@date-io/moment';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import ConfirmDialog from '../../components/confirm/';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import hospitalProvider from '../../../../data-access/hospital-provider';
import SetPassword from './set-password';
import userProvider from '../../../../data-access/user-provider';
import roleProvider from '../../../../data-access/role-provider';
import imageProvider from '../../../../data-access/image-provider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import zoneProvider from '../../../../data-access/zone-provider';
import provinceProvider from '../../../../data-access/province-provider';
import districtProvider from '../../../../data-access/district-provider';
import Avatar from '@material-ui/core/Avatar';
import GoogleMapReact from 'google-map-react';
import Search from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from "@material-ui/core/Checkbox";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const AnyReactComponent = ({ text }) => <div>{text}</div>;

var md5 = require('md5');
class CreateUpdateHospital extends React.PureComponent {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 65536).length > 0;
        let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 131072).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 262144).length > 0;

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
          addressHouse:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.addressHouse
              ? this.props.data.hospital.addressHouse
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
          passWord:
            this.props.data &&
            this.props.data.userAdmin &&
            this.props.data.userAdmin.passWord
              ? this.props.data.userAdmin.passWord
              : "",
          modalSetPassword: false,
          confirmDialog: false,
          dataUser: this.props.data.userAdmin,
          viewable,
          createable,
          updateable,
          places: [],
          listProvince: this.props.province,
          listDistrict: this.props.district,
          listZone: this.props.zone,
          provinceId:
            this.props.data &&
            this.props.data.province &&
            this.props.data.province.id
              ? this.props.data.province.id
              : this.props.province[0].id,
          districtId:
            this.props.data &&
            this.props.data.district &&
            this.props.data.district.id
              ? this.props.data.district.id
              : this.props.district[0].id,
          zoneId:
            this.props.data &&
            this.props.data.zone &&
            this.props.data.zone.id
              ? this.props.data.zone.id
              : this.props.zone[0].id,
          availableBooking:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.availableBooking
              ? this.props.data.hospital.availableBooking
              : 0,
          zoom: 13,
          maptype: "roadmap",
          place_formatted: "",
          place_id: "",
          place_location: "",
          lat:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.lat
              ? this.props.data.hospital.lat
              : 21.00843,
          lng:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.lon
              ? this.props.data.hospital.lon
              : 105.80143,
          checkMap: false,
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
          imageHome:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.imageHome
              ? this.props.data.hospital.imageHome
              : "",
          logo:
            this.props.data &&
            this.props.data.hospital &&
            this.props.data.hospital.logo
              ? this.props.data.hospital.logo
              : "",
          checkMapCreate: false
          // serviceDistrictError: false,
          // labelDistrict: false,
          // selectedDistrictValue: districtList,
          // serviceProvinceError: false,
          // labelProvince: false,
          // selectedProvinceValue: provinceList,
          // serviceMapError: false,
          // labelMap: false,
          // selectedMapValue: mapList,
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
        // let districtList = this.data2.district && (this.data2.district || []).map(item => { return { value: item.id, label: item.name } });
        // let provinceList = this.data2.province && (this.data2.province || []).map(item => { return { value: item.id, label: item.countryCode } });
        // let mapList = this.data2.hospital && (this.data2.hospital || []).map(item => { return { value: item.id, label: item.name } });
    }

    componentWillMount() {
        this.loadProvince();
        this.loadDistrictList();
        this.loadZoneList();
    }

    loadProvince() {
        provinceProvider.getAll().then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        countryCode: '--- Chọn Tỉnh / Thành phố (*) ---'
                    }
                ]
                for (var i = 0; i < s.data.provinces.length; i++) {
                    dataTemp.push(s.data.provinces[i])
                }
                this.setState({
                    listProvince: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    loadDistrictList() {
        districtProvider.getProvince(this.state.provinceId).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        name: '--- Chọn Quận / Huyện (*) ---'
                    }
                ]
                for (var i = 0; i < s.data.district.length; i++) {
                    dataTemp.push(s.data.district[i])
                }
                this.setState({
                    listDistrict: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    loadZoneList() {
        zoneProvider.getAll(this.state.districtId).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        name: '--- Chọn Xã / Phường / Thị trấn ---'
                    }
                ]
                for (var i = 0; i < s.data.zones.length; i++) {
                    dataTemp.push(s.data.zones[i])
                }
                this.setState({
                    listZone: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    loadDistrict(item) {
        districtProvider.getProvince(item).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        name: '--- Chọn Quận / Huyện (*) ---'
                    }
                ]
                for (var i = 0; i < s.data.district.length; i++) {
                    dataTemp.push(s.data.district[i])
                }
                this.setState({
                    listDistrict: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    loadZone(item) {
        zoneProvider.getAll(item).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        name: '--- Chọn Xã / Phường / Thị trấn ---'
                    }
                ]
                for (var i = 0; i < s.data.zones.length; i++) {
                    dataTemp.push(s.data.zones[i])
                }
                this.setState({
                    listZone: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    componentDidMount() {
        setTimeout(() => {
            let map;
            let markers = [];
            let lat = '';
            let lng = '';
            map = new window.google.maps.Map(window.document.getElementById('map'), {
                center: {
                    lat: this.state.lat,
                    lng: this.state.lng,
                },
                zoom: 14,
                mapTypeId: 'roadmap',
            });
            let marker = new window.google.maps.Marker({
                map: map,
                position: {
                    lat: this.state.lat,
                    lng: this.state.lng,
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
            let inputNode = document.getElementById('pac-input');
            let autoComplete = new window.google.maps.places.SearchBox(inputNode);
            map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);

            map.addListener('click', (event) => {
                lat = event.latLng.lat();
                lng = event.latLng.lng();
                console.log(lat);
                console.log(lng);
                addMarker(event.latLng);
                this.setState({
                    checkMap: true,
                    lat: lat,
                    lng: lng
                })

            });
            map.addListener('maptypeid_changed', () => {
                this.setState({
                    maptype: map.getMapTypeId(),
                });
            });
            map.addListener('bounds_changed', function () {
                autoComplete.setBounds(map.getBounds());
            });
            autoComplete.addListener('places_changed', () => {
                let places = autoComplete.getPlaces();
                if (places.length == 0) {
                    return;
                }
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];
                var bounds = new window.google.maps.LatLngBounds();
                if (places && places.length > 0) {
                    let place = places[0];
                    this.setState({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    }, () => {
                        places.forEach(place => {
                            addMarker(
                                {
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng()
                                });
                            if (place.geometry.viewport) {
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                        });
                    })
                }

                map.fitBounds(bounds);
                this.setState({
                    checkMap: true,
                    checkMapCreate: false
                })
            });
        }, 1000);


        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value) {
                return true
            } else {
                return value.isPhoneNumber();
            }
        });
        ValidatorForm.addValidationRule('isUrl', (value) => {
            if (!value) {
                return true
            } else {
                return value.isUrl();
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
        ValidatorForm.addValidationRule('isNickname', (value) => {
            // return false;
            var re = /^([a-zA-Z0-9_])*$/g;
            if (!value) {
                return true
            }
            return re.test(value.toLowerCase());
            // else {
            //     let x = ;
            //     if (x) return true;
            //     return value.isEmail();
            //         return true
            //     return false;
            // }
            // }
        });
        ValidatorForm.addValidationRule('chosseProvince', (value) => {
            if (value == -1)
                return false
            return true
        });
        ValidatorForm.addValidationRule('chosseDistrict', (value) => {
            if (value == -1)
                return false
            return true
        });
        ValidatorForm.addValidationRule('chosseZone', (value) => {
            if (value == -1)
                return false
            return true
        });

    }

    modalSetPassword() {
        if (this.state.updateable) {
            this.setState({ modalSetPassword: true })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

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

    closeModal() {
        this.setState({ modalSetPassword: false });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    checkCreate() {

    }

    create = () => {
        debugger
        this.validator.submit();
        this.validator.isFormValid().then(result => {
            if (!result)
                return;
            this.setState({ hasErrorGender: false, hasErrorDegree: false });
            const { lat, lng, dataHospital, images, avatar,imageHome, logo, name, phone, email, taxCode, passWord, addressHouse, username, serviceUrl, provinceId, districtId, zoneId, availableBooking } = this.state;
            let id = dataHospital && dataHospital.hospital ? dataHospital.hospital.id : '';
            let param = {
                hospital: {
                    name: name.trim(),
                    taxCode: taxCode.trim(),
                    addressHouse,
                    serviceUrl,
                    lat: lat,
                    lon: lng,
                    images: images,
                    avatar: avatar,
                    logo: logo,
                    imageHome: imageHome
                }, username: username.trim(),
                email,
                phone,
                password: id ? null : md5(passWord),
                role: 8,
                active: 1,
                provinceId,
                districtId,
                zoneId: zoneId == -1 ? null : zoneId,
                availableBooking: availableBooking
            }
            if (dataHospital && dataHospital.hospital && dataHospital.hospital.id) {
                hospitalProvider.update(id, param).then(s => {
                    switch (s.code) {
                        case 0:
                            toast.success("Cập nhật " + name + " thành công!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            this.handleClose();
                            break
                        case 2:
                            toast.error("Số điện thoại đã được sử dụng trong hệ thống. Vui lòng sử dụng số điện thoại khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 3:
                            toast.error("Email đã được sử dụng trong hệ thống. Vui lòng sử dụng email khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 11:
                            toast.error("Mã số thuế đã được sử dụng trong hệ thống. Vui lòng sử dụng mã số thuế khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 12:
                            toast.error("username đã được sử dụng trong hệ thống. Vui lòng sử dụng username khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        default:
                            toast.error(constants.message.hospital.update_error, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        // this.handleClose();
                    }
                }).catch(e => {
                    toast.error(e.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                })
            } else {
                hospitalProvider.create(param).then(s => {
                    switch (s.code) {
                        case 0:
                            toast.success("Tạo mới tài khoản " + name + " thành công!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            this.handleClose();
                            break;
                        case 2:
                            toast.error("Số điện thoại đã được sử dụng trong hệ thống. Vui lòng sử dụng số điện thoại khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 3:
                            toast.error("Email đã được sử dụng trong hệ thống. Vui lòng sử dụng email khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 11:
                            toast.error("Mã số thuế đã được sử dụng trong hệ thống. Vui lòng sử dụng mã số thuế khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 12:
                            toast.error("Username đã được sử dụng trong hệ thống. Vui lòng sử dụng username khác.", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        default:
                            toast.error("Tạo mới tài khoản không thành công!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        // this.handleClose();
                    }
                }).catch(e => {
                    toast.error(e.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                })
            }
        })
    }

    active = (type) => {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            const { dataHospital } = this.state;
            let id = dataHospital && dataHospital.hospital ? dataHospital.hospital.id : '';
            let param = { active: dataHospital.hospital.active == 1 ? 0 : 1 };
            hospitalProvider.active(id, param).then(s => {
                toast.success("Cập nhật " + dataHospital.hospital.name + " thành công", {
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


    uploadAvatarLogo(event, active) {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        let sizeImage = event.target.files[0].size / 1048576;
        if (fileName.endsWith(".jpg") ||
            fileName.endsWith(".png")) {
            if (sizeImage > 2) {
                toast.error("Ảnh không vượt quá dung lượng 2MB", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                imageProvider.upload(event.target.files[0]).then(s => {
                    if (s && s.data.code == 0 && s.data.data) {
                        if (active == 1) {
                            this.setState({
                                avatar: s.data.data.images[0].image,
                            })
                            this.data2.avatar = s.data.data.images[0].image;
                        } else if (active == 2) {
                            this.setState({
                                images: s.data.data.images[0].image,
                            })
                            this.data2.images = s.data.data.images[0].image;
                        } else if (active == 3) {
                            this.setState({
                                logo: s.data.data.images[0].image,
                            })
                            this.data2.logo = s.data.data.images[0].image;
                        } else if (active == 4) {
                            this.setState({
                                imageHome: s.data.data.images[0].image,
                            })
                            this.data2.imageHome = s.data.data.images[0].image;
                        }
                    } else {
                        toast.error("Vui lòng thử lại !", {
                            position: toast.POSITION.TOP_LEFT
                        });
                    }
                    this.setState({ progress: false })
                }).catch(e => {
                    this.setState({ progress: false })
                })
            }

        } else {
            toast.error("Vui lòng chọn hình ảnh có định dạng png, jpg", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    render() {
        const { classes } = this.props;
        const {
          dataHospital,
          taxCode,
          username,
          images,
          imageHome,
          logo,
          name,
          phone,
          email,
          passWord,
          avatar,
          addressHouse,
          availableBooking, 
          dataUser,
          serviceUrl,
          updateable,
          provinceId,
          zoneId,
          districtId,
          listProvince,
          listDistrict,
          listZone,
          places
        } = this.state;
        debugger;
        return (
            <div style={{ backgroundColor: 'red' }} id='maplist'>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth="lg"
                    maxWidth="lg"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm ref={ref => this.validator = ref}>
                        <DialogTitle id="alert-dialog-slide-title">
                            {dataHospital.hospital && dataHospital.hospital.id ? 'Cập nhật cơ sở y tế ' : 'Tạo mới cơ sở y tế'}
                            {
                                dataHospital.hospital && dataHospital.hospital.id && updateable ?
                                    <Button style={{ float: 'right' }} onClick={() => this.modalSetPassword()} variant="contained" color="inherit">Set password</Button> : ''
                            }
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6}>
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Tên CSYT (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Tên CSYT không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataHospital.hospital && dataHospital.hospital.id ?
                                        <TextValidator
                                            disabled
                                            value={taxCode}
                                            id="taxCode" name="taxCode" label="Mã số thuế"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.taxCode = event.target.value; this.setState({ taxCode: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxCertificateCode']}
                                            errorMessages={['Mã số thuế không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!']}
                                        /> :
                                        <TextValidator
                                            value={taxCode}
                                            id="taxCode" name="taxCode" label="Mã số thuế (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.taxCode = event.target.value; this.setState({ taxCode: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxCertificateCode']}
                                            errorMessages={['Mã số thuế không được bỏ trống!', 'Không cho phép nhập quá 20 kí tự!']}
                                        />}
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
                                <Grid item xs={12} md={6}>
                                    {dataHospital.hospital && dataHospital.hospital.id ?
                                        <TextValidator
                                            disabled
                                            value={username}
                                            id="username" name="username" label="Username"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.username = event.target.value; this.setState({ username: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength50', 'isNickname']}
                                            errorMessages={['Username không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!', 'Username không hợp lệ!']}
                                        /> :
                                        <TextValidator
                                            value={username}
                                            id="username" name="username" label="Username (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.username = event.target.value; this.setState({ username: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength50', 'isNickname']}
                                            errorMessages={['Username không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!', 'Username không hợp lệ!']}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {dataHospital.hospital && dataHospital.hospital.id ?
                                        <TextValidator
                                            value={serviceUrl} id="serviceUrl" label="Url"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.serviceUrl = event.target.value; this.setState({ serviceUrl: event.target.value }) }}
                                            margin="normal"
                                            validators={['maxLength', 'isUrl']}
                                            errorMessages={['Không cho phép nhập quá 255 kí tự!', 'Url không hợp lệ!']}
                                        /> :
                                        <TextValidator
                                            type="password"
                                            value={passWord} id="passWord" name="passWord" label="Mật khẩu (*)"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.passWord = event.target.value; this.setState({ passWord: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'minPassword']}
                                            errorMessages={['Mật khẩu không được bỏ trống!', 'Mật khẩu dài ít nhất 8 ký tự!']}
                                        />}
                                </Grid>
                                {
                                    dataHospital.hospital && dataHospital.hospital.id ? '' :
                                        <Grid item xs={12} md={12}>
                                            <TextValidator
                                                value={serviceUrl} id="serviceUrl" label="Url"
                                                className={classes.textField}
                                                onChange={(event) => { this.data2.serviceUrl = event.target.value; this.setState({ serviceUrl: event.target.value }) }}
                                                margin="normal"
                                                validators={['maxLength', 'isUrl']}
                                                errorMessages={['Không cho phép nhập quá 255 kí tự!', 'Url không hợp lệ!']}
                                            />
                                        </Grid>
                                }
                                <Grid item xs={12} md={6}>
                                    <Grid item xs={12} md={3}>
                                        <div>
                                            <span style={{ fontSize: 17, marginRight: 15 }}>Logo: </span>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                style={{ display: 'none' }}
                                                id="upload_logo"
                                                onChange={(event) => { this.data2.avatar = event.target.files[0].name; this.uploadAvatarLogo(event, 1) }}
                                                type="file"
                                            />
                                            <label htmlFor="upload_logo">
                                                <Button component="span">
                                                    <img style={{ width: 30, margin: 'auto', border: "1px soild" }}
                                                        src="/image-icon.png" />
                                                </Button>
                                            </label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <div style={{ marginLeft: '18%', marginBottom: 12 }}>
                                            {
                                                avatar ? <img style={{ height: 100, margin: 'auto', border: "1px soild" }}
                                                    src={avatar.absoluteUrl()} /> : null
                                            }
                                        </div>
<div style={{ fontSize: 14, fontStyle: 'italic', marginLeft: '18%' }}>Kích thước ảnh tiêu chuẩn: 50x50</div>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div>
                                        <span style={{ fontSize: 17, marginRight: 15 }}>Logo header: </span>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            style={{ display: 'none' }}
                                            id="upload_logo_header"
                                            onChange={(event) => { this.data2.images = event.target.files[0].name; this.uploadAvatarLogo(event, 2) }}
                                            type="file"
                                        />
                                        <label htmlFor="upload_logo_header">
                                            <Button component="span">
                                                <img style={{ width: 30, margin: 'auto', border: "1px soild" }}
                                                    src="/image-icon.png" />
                                            </Button>
                                        </label>
                                        <div style={{ marginBottom: 12 }}>
                                            {
                                                images ? <img style={{ marginLeft: '23%', height: 100, border: "1px soild" }}
                                                    src={images.absoluteUrl()} /> : null
                                            }
                                        </div>
                                        <div style={{ fontSize: 14, fontStyle: 'italic', marginLeft: '23%' }}>Kích thước ảnh tiêu chuẩn: 220x52</div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid item xs={12} md={3}>
                                        <div>
                                            <span style={{ fontSize: 17, marginRight: 15 }}>Avatar: </span>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                style={{ display: 'none' }}
                                                id="upload_avatar"
                                                onChange={(event) => { this.data2.logo = event.target.files[0].name; this.uploadAvatarLogo(event, 3) }}
                                                type="file"
                                            />
                                            <label htmlFor="upload_avatar">
                                                <Button component="span">
                                                    <img style={{ width: 30, margin: 'auto', border: "1px soild" }}
                                                        src="/image-icon.png" />
                                                </Button>
                                            </label>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <div style={{ marginLeft: '18%', marginBottom: 12 }}>
                                            {
                                                avatar ? <img style={{ height: 100, margin: 'auto', border: "1px soild" }}
                                                    src={logo.absoluteUrl()} /> : null
                                            }
                                        </div>
                                        <div style={{ fontSize: 14, fontStyle: 'italic', marginLeft: '18%' }}>Kích thước ảnh tiêu chuẩn: 50x50</div>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <div>
                                        <span style={{ fontSize: 17, marginRight: 15 }}>Ảnh hiển thị: </span>
                                        <input
                                            accept="image/*"
                                            className={classes.input}
                                            style={{ display: 'none' }}
                                            id="upload_imageHome"
                                            onChange={(event) => { this.data2.imageHome = event.target.files[0].name; this.uploadAvatarLogo(event, 4) }}
                                            type="file"
                                        />
                                        <label htmlFor="upload_imageHome">
                                            <Button component="span">
                                                <img style={{ width: 30, margin: 'auto', border: "1px soild" }}
                                                    src="/image-icon.png" />
                                            </Button>
                                        </label>
                                        <div style={{ marginBottom: 12 }}>
                                            {
                                                images ? <img style={{ marginLeft: '23%', height: 100, border: "1px soild" }}
                                                    src={imageHome.absoluteUrl()} /> : null
                                            }
                                        </div>
                                        <div style={{ fontSize: 14, fontStyle: 'italic', marginLeft: '23%' }}>Kích thước ảnh tiêu chuẩn: 220x52</div>
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid item xs={12} md={12}>
                                        <div style={{ marginBottom: '25px' }}></div>
                                        {
                                            this.state.provinceId == -1 ? null : <div style={{ position: "absolute", marginTop: -12, fontSize: 13, color: 'rgba(0, 0, 0, 0.54)' }}>Tỉnh / Thành phố (*):</div>
                                        }
                                        <SelectValidator
                                            value={provinceId}
                                            onChange={(event) => {
                                                this.data2.provinceId = event.target.value;
                                                this.setState({ provinceId: event.target.value });
                                                this.loadDistrict(event.target.value);
                                            }}
                                            inputProps={{ name: 'selectProvince', id: 'selectProvince' }}
                                            validators={["chosseProvince"]}
                                            errorMessages={["Tỉnh / Thành phố không được bỏ trống!"]}
                                            style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                listProvince && listProvince.length && listProvince.map((option, index) =>
                                                    <MenuItem key={index} value={option.id}>{option.countryCode}</MenuItem>
                                                )
                                            }
                                        </SelectValidator>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <div style={{ marginBottom: '25px' }}></div>
                                        {
                                            this.state.districtId == -1 ? null : <div style={{ position: "absolute", marginTop: -12, fontSize: 13, color: 'rgba(0, 0, 0, 0.54)' }}>Quận / Huyện (*):</div>
                                        }
                                        <SelectValidator
                                            value={districtId}
                                            onChange={(event) => {
                                                this.data2.districtId = event.target.value;
                                                this.setState({ districtId: event.target.value });
                                                this.loadZone(event.target.value);
                                            }}
                                            validators={["chosseDistrict"]}
                                            errorMessages={["Quận / Huyện không được bỏ trống!"]}
                                            inputProps={{ name: 'selectDistrict', id: 'selectDistrict' }}
                                            style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                listDistrict && listDistrict.length && listDistrict.map((option, index) =>
                                                    <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                )
                                            }
                                        </SelectValidator>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <div style={{ marginBottom: '25px' }}></div>
                                        {
                                            this.state.zoneId == -1 ? null : <div style={{ position: "absolute", marginTop: -12, fontSize: 13, color: 'rgba(0, 0, 0, 0.54)' }}>Xã / Phường / Thị trấn</div>
                                        }
                                        <SelectValidator
                                            value={zoneId}
                                            onChange={(event) => { this.data2.zoneId = event.target.value; this.setState({ zoneId: event.target.value }) }}
                                            inputProps={{ name: 'selectZone', id: 'selectZone' }}
                                            style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                listZone && listZone.length && listZone.map((option, index) =>
                                                    <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                )
                                            }
                                        </SelectValidator>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextValidator
                                            value={addressHouse} id="addressHouse" label="Số nhà / Thôn / Xóm (*):"
                                            className={classes.textField}
                                            onChange={(event) => { this.data2.addressHouse = event.target.value; this.setState({ addressHouse: event.target.value }) }}
                                            margin="normal"
                                            validators={['required', 'maxLength']}
                                            errorMessages={['Số nhà / Thôn / Xóm không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={5} style={{ fontSize: 16, marginTop: 9}}>
                                        <div>Có thể đặt khám</div>
                                    </Grid>
                                    <Grid item xs={12} md={7}>
                                        <Checkbox
                                            checked={availableBooking === 1 ? true : false}
                                            onChange= {(event) => { this.data2.availableBooking = event.target.checked ? 1 : 0; this.setState({ availableBooking: event.target.checked ? 1 : 0 })}}
                                            value="availableBooking"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6} style={{ marginTop: '3%' }}>
                                    <div style={{ fontSize: 18, fontWeight: 400, marginBottom: 10 }}>Vị trí bản đồ:</div>
                                    <div id='app'>
                                        <div id='map' style={{ width: '100%', height: 350 }} />
                                        <div id='pac-container'>
                                            <input id='pac-input' type='text' style={{ marginTop: 11, width: '55%', height: 40, fontSize: 16, borderRadius: 4 }} placeholder='Nhập địa chỉ ...' />
                                            {/* <IconButton color="primary" className={classes.button} aria-label="SearchIcon" style={{ position: 'absolute', marginTop: -342, marginLeft: '38%', color: 'darkgrey' }}>
                                                <Search />
                                            </IconButton> */}
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            {
                                this.data != JSON.stringify(this.data2) || this.state.checkMap ?
                                    <Button variant="contained" color="primary" type="button" onClick={this.create}>Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            }
                            {
                                updateable && dataHospital.hospital && dataHospital.hospital.id ?
                                    <Button onClick={() => this.modalConfirmDialog()} variant="contained" color="secondary">{dataHospital.hospital && dataHospital.hospital.active ? 'Inactive' : 'Active'}</Button> : null
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {this.state.modalSetPassword && <SetPassword data={dataUser} callbackOff={this.closeModal.bind(this)} />}
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={dataHospital.hospital.active ? "Bạn có muốn cập nhật trạng thái từ Active sang Inactive" : "Bạn có muốn cập nhật trạng thái từ Inactive sang Active"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.active.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateHospital));