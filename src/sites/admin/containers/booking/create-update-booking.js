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
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from '../../components/confirm/';
import stringUtils from 'mainam-react-native-string-utils';
import RoleProvider from '../../../../data-access/role-provider';
import PermissionProvider from '../../../../data-access/permission-provider';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import serviceProvider from '../../../../data-access/service-provider';
import bookingProvider from '../../../../data-access/booking-provider';
import serviceTypeProvider from '../../../../data-access/serviceType-provider';
import { Redirect } from 'react-router-dom'
import { debuglog } from 'util';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TablePaginationActions from '../../components/pagination/pagination';
function Transition(props) {

    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateRole extends React.Component {
    constructor(props) {
        super(props)
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 536870912).length > 0;
        // let createable = this.props.userApp.currentUser.permission.filter(item => item.value == 1048576).length > 0;
        this.state = {
            page: 0,
            size: 10,
            open: true,
            permissionIds: [],
            dataBooking: this.props.data,
            dataPermission: this.props.permission,
            createPersonId: (this.props.userApp.currentUser || {}).id,
            updatePersonId: (this.props.userApp.currentUser || {}).id,
            name: this.props.data && this.props.data.booking && this.props.data.booking.name ? this.props.data.booking.name : '',
            images: this.props.data && this.props.data.booking && this.props.data.booking.images ? this.props.data.booking.images : '',
            content: this.props.data && this.props.data.booking && this.props.data.booking.content ? this.props.data.booking.content : '',
            confirmDialog: false,
            progress: false,
            listServiceType: [],
            checked: false,
            viewable,
            serviceTypeId: this.props.data.serviceType ? this.props.data.serviceType.id : -1,
            specialistId: this.props.data.specialist ? this.props.data.specialist.id : -1,
            bookingTime: this.props.data && this.props.data.booking && this.props.data.booking.bookingTime ? this.props.data.booking.bookingTime : null,
            timeList: this.props.data && this.props.data.booking && this.props.data.booking.bookingTime ? moment(this.props.data.booking.bookingTime).format('HH:mm:ss') : -1,
            listTimeBooking: [
                // {
                //     timeList: {
                //         value: -1,
                //         name: 'Chọn giờ hẹn',
                //     }
                // },
                {
                    timeList: {
                        value: '08:00:00',
                        name: '08:00',
                    }
                },
                {
                    timeList: {
                        value: '08:30:00',
                        name: '08:30',
                    }
                },
                {
                    timeList: {
                        value: '09:00:00',
                        name: '09:00',
                    }
                },
                {
                    timeList: {
                        value: '09:30:00',
                        name: '09:30',
                    }
                },
                {
                    timeList: {
                        value: '10:00:00',
                        name: '10:00',
                    }
                },
                {
                    timeList: {
                        value: '10:30:00',
                        name: '10:30',
                    }
                },
                {
                    timeList: {
                        value: '11:00:00',
                        name: '11:00',
                    }
                },
                {
                    timeList: {
                        value: '13:30:00',
                        name: '13:30',
                    }
                },
                {
                    timeList: {
                        value: '14:00:00',
                        name: '14:00',
                    }
                },
                {
                    timeList: {
                        value: '14:30:00',
                        name: '14:30',
                    }
                },
                {
                    timeList: {
                        value: '15:00:00',
                        name: '15:00',
                    }
                },
                {
                    timeList: {
                        value: '15:30:00',
                        name: '15:30',
                    }
                },
                {
                    timeList: {
                        value: '16:00:00',
                        name: '16:00',
                    }
                }
            ],
        };
        console.log(this.data)
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentWillMount() {
        // this.getServiceType();
        this.getService()
        this.listImages();
        // if (this.state.serviceTypeId > 0) {
        //     this.getService();
        // }
    }
    listImages() {
        if (this.state.images) {
            let listImages = this.state.images.split(',');
            this.setState({
                images: listImages
            })
        }
    }

    getService(item) {
        let params = {
            specialistId: this.state.specialistId,
            // serviceTypeId: item ? item : this.state.serviceTypeId,
            name: this.state.name.trim(),
            page: this.state.page + 1,
            size: this.state.size,
        }
        let hospitalId = this.state.dataBooking.hospital.id
        serviceProvider.getAll(hospitalId, params).then(s => {
            if (s && s.code == 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                let listService = s.data.data.map(item => {
                    if (this.state.dataBooking.services) {
                        item.checked = this.state.dataBooking.services.filter(x => x.id == item.service.id).length > 0;
                    }
                    return item;
                });
                let listServiceSort = listService.sort((a, b) => {
                    return b.checked - a.checked
                })
                this.setState({
                    listService: listService,
                    total: s.data.total,
                    stt: stt,
                    listServiceSort: listServiceSort
                })
                


            }
        }).catch(e => {
        })
    }
    // getServiceType() {
    //     let hospitalId = this.state.dataBooking.hospital.id
    //     let data = {
    //         hospitalId: hospitalId
    //     }
    //     serviceTypeProvider.getAll(data).then(s => {
    //         if (s && s.code == 0 && s.data) {
    //             // let dataTemp = [
    //             //     {
    //             //         id: -1,
    //             //         name: 'Chọn loại dịch vụ (*)'
    //             //     }
    //             // ]
    //             // for (var i = 0; i < s.data.serviceType.length; i++) {
    //             //     dataTemp.push(s.data.serviceType[i])
    //             // }
    //             this.setState({
    //                 listServiceType: s.data.serviceType,
    //             })
    //         }
    //     }).catch(e => {
    //     })
    // }

    componentDidMount() {
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 500)
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    toggleChange = () => {
        this.setState({
            checked: !this.state.checked,
        });
    }
    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.getService()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getService()
        });
    };
    create = () => {
        const { dataBooking, content, serviceTypeId, bookingTime, timeList, stt, total, listService } = this.state;
        let id = dataBooking && dataBooking.booking ? dataBooking.booking.id : '';
        let listServiceIds = [];
        if (listService) {
            let arr = listService.filter(t => t.checked === true);
            for (let i = 0; i < arr.length; i++) {
                listServiceIds.push(arr[i].service.id)
            }
        }

        // if (arr.length == 0) {
        //     toast.error("Chưa chọn permission!", {
        //         position: toast.POSITION.TOP_RIGHT
        //     })
        //     return
        // }

        let date = this.state.bookingTime ? moment(this.state.bookingTime).format('YYYY-MM-DD').toString() : null;
        let dateTime = date + " " + timeList
        let param = {
            content: content,
            serviceId: listServiceIds.toString(),
            // serviceTypeId: serviceTypeId,
            bookingTime: dateTime
        }
        if (dataBooking && dataBooking.booking && dataBooking.booking.id) {
            // if (this.validateDataSend() === '') {
            bookingProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        this.handleClose();
                        toast.success("Cập nhật đặt khám thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    // case 2:
                    //     toast.error("Mã role đã được sử dụng trong hệ thống. Vui lòng sử dụng Mã role khác!", {
                    //         position: toast.POSITION.TOP_RIGHT
                    //     });
                    //     break;
                    default:
                        toast.error("Cập nhật đặt khám không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        console.log(s)
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            // } else {
            //     alert(this.validateDataSend())
            // }
        } else {
            // if (this.validateDataSend() === '') {
            RoleProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        this.handleClose();
                        toast.success("Tạo mới đặt khám thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break
                    // case 2:
                    //     toast.error("Mã role đã được sử dụng trong hệ thống. Vui lòng sử dụng Mã role khác!", {
                    //         position: toast.POSITION.TOP_RIGHT
                    //     });
                    //     break;
                    default:
                        toast.error("Tạo mới đặt khám không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            // } 
        }
    }
    handleChangeFilter(event, index) {
        if (index == 1) {
            this.setState({
                page: 0,
                name: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.getService();
                }, 500)
            })
        }
    }

    render() {
        const { classes } = this.props;
        let minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        const { dataBooking, content, listServiceType, permission, stt, images, progress, name, confirmDialog, total, size, page, deleteable, serviceTypeId, listService, bookingTime, listTimeBooking, timeList } = this.state;
        console.log(dataBooking);

        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">

                    <ValidatorForm>
                        <DialogTitle id="alert-dialog-slide-title">
                            {dataBooking.booking && dataBooking.booking.id ? 'Cập nhật Đặt khám ' : 'Tạo mới Đặt khám'}
                            {dataBooking.booking && dataBooking.booking.id && deleteable ? <Button style={{ float: "right" }} onClick={() => this.showModalDelete(dataBooking)} variant="contained" color="inherit">Xóa</Button> : null}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={3}>Hồ sơ:</Grid>
                                <Grid item xs={12} md={9}>{dataBooking.medicalRecords.name}</Grid>
                                <Grid item xs={12} md={3}>Địa điểm:</Grid>
                                <Grid item xs={12} md={9}>{dataBooking.hospital.name}</Grid>
                                <Grid item xs={12} md={3} className="class-title-booking">Ghi chú và mô tả triệu chứng:</Grid>
                                <Grid item xs={12} md={9}>
                                    {/* <TextValidator
                                        value={content}
                                        id="content" name="content"
                                        className={classes.textField}
                                        placeholder="Nhập Ghi chú và mô tả triệu chứng"
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.content = event.target.value; this.setState({ content: event.target.value }) }}
                                        margin="normal"
                                        validators={['maxLength']}
                                        errorMessages={['Không cho phép nhập quá 500 kí tự!']}
                                        style={{ marginTop: 30 }}
                                    /> */}
                                    <textarea
                                        rows="3"
                                        value={content}
                                        placeholder="  Nhập Ghi chú và mô tả triệu chứng"
                                        id="content" name="content"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.content = event.target.value; this.setState({ content: event.target.value }) }}
                                        margin="normal"
                                        style={{ marginTop: 24 }}
                                    />
                                    {
                                        this.state.content.length > 500 ? <div className="textarea-error-booking">Không cho phép nhập quá 500 kí tự</div> : null
                                    }
                                </Grid>
                                <Grid item xs={12} md={3}></Grid>
                                <Grid item xs={12} md={9}>
                                    {
                                        images && images.length ? images.map((option, index) =>
                                            <img
                                                style={{ width: 100, height: 100, marginRight: 20, marginTop: 10 }} alt=""
                                                // onClick={() => this.modalDetailImage(index)}
                                                src={images ? option.absoluteUrl() : ""}
                                            />
                                        ) : ""
                                    }
                                </Grid>
                                <Grid item xs={12} md={3} className="class-title-booking">Thời gian:</Grid>
                                <Grid item xs={12} md={9}>
                                    <div style={{ marginBottom: '16px' }}></div>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={bookingTime}
                                            // label="Ngày sinh"
                                            minDate={minDate}
                                            onChange={(date) => { this.data2.bookingTime = date; this.setState({ bookingTime: date }) }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                            style={{ width: '100%', marginTop: -8 }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={3} className="class-title-booking">Giờ:</Grid>
                                <Grid item xs={12} md={9}>
                                    <SelectValidator
                                        value={timeList}
                                        onChange={(event) => { this.data2.timeList = event.target.value; this.setState({ timeList: event.target.value }) }}
                                        inputProps={{ name: 'selectRole', id: 'selectRole' }}
                                        displayEmpty
                                        validators={["chosseRole"]}
                                        errorMessages={["Giờ hẹn không được để trống!"]}
                                        style={{ width: '100%', marginTop: 11 }}>
                                        {
                                            listTimeBooking && listTimeBooking.map((option, index) =>
                                                <MenuItem key={index} value={option.timeList.value}>{option.timeList.name}</MenuItem>
                                            )
                                        }
                                    </SelectValidator>
                                </Grid>

                                {dataBooking.booking.status !== 3 ?
                                    <Grid container>
                                        {/* <Grid item xs={12} md={3} className="class-title-booking">Loại dịch vụ (*):</Grid>
                                        <Grid item xs={12} md={9}>
                                            <SelectValidator
                                                value={serviceTypeId}
                                                onChange={(event) => { this.data2.serviceTypeId = event.target.value; this.setState({ serviceTypeId: event.target.value }); this.getService(event.target.value) }}
                                                inputProps={{ name: 'selectRole', id: 'selectRole' }}
                                                displayEmpty
                                                validators={["chosseRole"]}
                                                errorMessages={["Loại dịch vụ không được để trống!"]}
                                                style={{ width: '100%', marginTop: 8 }}>
                                                {
                                                    listServiceType && listServiceType.map((option, index) =>
                                                        <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                    )
                                                }
                                            </SelectValidator>
                                        </Grid> */}
                                        <Grid item xs={12} md={3} style={{ marginTop: 24 }}>Dịch vụ:</Grid>
                                        <Grid className="custom-width" item xs={12} md={9} style={{ marginLeft: "-1%" }}>
                                            <TextField
                                                id="outlined-textarea"
                                                // label="Tên BN / Dịch vụ"
                                                placeholder="Tìm kiếm"
                                                // multiline
                                                className={classes.textField}
                                                margin="normal"
                                                // variant="outlined"
                                                value={name}
                                                onChange={(event) => this.handleChangeFilter(event, 1)}
                                            />
                                        </Grid>
                                        {/* <Grid>
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Role (*)"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Role không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid> */}
                                        <Grid item xs={12} md={12}>
                                            <div className={classes.tableWrapper}>
                                                {/* <EnhancedTableToolbar
                                            title="Dịch vụ"
                                        /> */}
                                                {progress ? <LinearProgress /> : null}
                                                {/* <DialogContent> */}
                                                <Table className={classes.table} aria-labelledby="tableTitle" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>STT</TableCell>
                                                            <TableCell>Tên dịch vụ</TableCell>
                                                            <TableCell>Giá (VNĐ)</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>Trạng thái</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            listService && listService.length ? listService.map((item, index) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        key={index}
                                                                        tabIndex={-1}>
                                                                        <TableCell>{index + stt}</TableCell>
                                                                        <TableCell>{item.service.name}</TableCell>
                                                                        <TableCell>{item.service.price ? Number(item.service.price).formatPrice() : ""}</TableCell>
                                                                        <TableCell style={{ textAlign: 'center' }}>
                                                                            {
                                                                                item.checked ?
                                                                                    <Checkbox
                                                                                        onChange={(event) => { item.checked = !item.checked; this.data2.code = event.target.value; this.setState({ listService: [...listService] }) }}
                                                                                        checked={true}
                                                                                    /> :
                                                                                    <Checkbox
                                                                                        onChange={(event) => { item.checked = !item.checked; this.data2.code = event.target.value; this.setState({ listService: [...listService] }) }}
                                                                                        checked={false} />
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>

                                                                );
                                                            })
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan="4">{this.state.name ? 'Không có kết quả phù hợp' : 'Vui lòng chọn loại dịch vụ'}</TableCell>
                                                                </TableRow>
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TablePagination
                                                                labelRowsPerPage="Số dòng trên trang"
                                                                rowsPerPageOptions={[10, 20, 50, 100]}
                                                                count={total}
                                                                rowsPerPage={size}
                                                                page={page}
                                                                onChangePage={this.handleChangePage}
                                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                                ActionsComponent={TablePaginationActions}
                                                            />
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                                {/* </DialogContent> */}
                                            </div>
                                        </Grid>
                                    </Grid>
                                    :
                                    <Grid container spacing={16}>
                                        {/* <Grid item xs={12} md={3} className="class-title-booking">Loại dịch vụ (*):</Grid>
                                        <Grid item xs={12} md={9}>
                                            <SelectValidator
                                                disabled
                                                value={serviceTypeId}
                                                onChange={(event) => { this.data2.serviceTypeId = event.target.value; this.setState({ serviceTypeId: event.target.value }); this.getService(event.target.value) }}
                                                inputProps={{ name: 'selectRole', id: 'selectRole' }}
                                                displayEmpty
                                                validators={["chosseRole"]}
                                                errorMessages={["Loại dịch vụ không được để trống!"]}
                                                style={{ width: '100%', marginTop: 8 }}>
                                                {
                                                    listServiceType && listServiceType.map((option, index) =>
                                                        <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                    )
                                                }
                                            </SelectValidator>
                                        </Grid> */}
                                        <Grid item xs={12} md={3} style={{ marginTop: 24 }}>Dịch vụ:</Grid>
                                        <Grid className="custom-width" item xs={12} md={9} style={{ marginLeft: "-1%" }}>
                                            <TextField

                                                id="outlined-textarea"
                                                // label="Tên BN / Dịch vụ"
                                                placeholder="Tìm kiếm"
                                                // multiline
                                                className={classes.textField}
                                                margin="normal"
                                                // variant="outlined"
                                                value={name}
                                                onChange={(event) => this.handleChangeFilter(event, 1)}
                                            />
                                        </Grid>
                                        {/* <Grid>
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Role (*)"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Role không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid> */}
                                        <Grid item xs={12} md={12}>
                                            <div className={classes.tableWrapper}>
                                                {/* <EnhancedTableToolbar
                                            title="Dịch vụ"
                                        /> */}
                                                {progress ? <LinearProgress /> : null}
                                                {/* <DialogContent> */}
                                                <Table className={classes.table} aria-labelledby="tableTitle" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>STT</TableCell>
                                                            <TableCell>Tên dịch vụ</TableCell>
                                                            <TableCell>Giá (VNĐ)</TableCell>
                                                            <TableCell style={{ textAlign: 'center' }}>Trạng thái</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            listService && listService.length ? listService.map((item, index) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        key={index}
                                                                        tabIndex={-1}>
                                                                        <TableCell>{index + stt}</TableCell>
                                                                        <TableCell>{item.service.name}</TableCell>
                                                                        <TableCell>{item.service.price ? Number(item.service.price).formatPrice() : ""}</TableCell>
                                                                        <TableCell style={{ textAlign: 'center' }}>
                                                                            {
                                                                                item.checked ?
                                                                                    <Checkbox
                                                                                        disabled
                                                                                        onChange={(event) => { item.checked = !item.checked; this.data2.code = event.target.value; this.setState({ listService: [...listService] }) }}
                                                                                        checked={true}
                                                                                    /> :
                                                                                    <Checkbox
                                                                                        disabled
                                                                                        onChange={(event) => { item.checked = !item.checked; this.data2.code = event.target.value; this.setState({ listService: [...listService] }) }}
                                                                                        checked={false} />
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>

                                                                );
                                                            })
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan="4">{this.state.name ? 'Không có kết quả phù hợp' : 'Vui lòng chọn loại dịch vụ'}</TableCell>
                                                                </TableRow>
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TablePagination
                                                                labelRowsPerPage="Số dòng trên trang"
                                                                rowsPerPageOptions={[10, 20, 50, 100]}
                                                                count={total}
                                                                rowsPerPage={size}
                                                                page={page}
                                                                onChangePage={this.handleChangePage}
                                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                                ActionsComponent={TablePaginationActions}
                                                            />
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                                {/* </DialogContent> */}
                                            </div>
                                        </Grid>
                                    </Grid>
                                }

                            </Grid>

                        </DialogContent>
                        {/* <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            <Button variant="contained" color="primary" type="submit">Ok</Button>
                        </DialogActions> */}
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                            {
                                this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" onClick={() => this.create()}>Cập nhật</Button> :
                                    <Button variant="contained" color="primary" disabled>Cập nhật</Button>
                            }

                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa role này ra khỏi danh sách?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateRole));