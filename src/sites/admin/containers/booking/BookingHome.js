import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import SortIcon from '@material-ui/icons/Sort';
import EditIcon from '@material-ui/icons/Edit';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import AddIcon from '@material-ui/icons/Add';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm';
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import roleProvider from '../../../../data-access/role-provider';
import bookingProvider from '../../../../data-access/booking-provider';
import Detail from './detail-booking';
import userProvider from '../../../../data-access/user-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { withStyles } from '@material-ui/core/styles';
import { Col, Row } from 'reactstrap';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import DialogActions from '@material-ui/core/DialogActions';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Loop from '@material-ui/icons/Loop';


class wordTime extends Component {
    constructor(props) {
        super(props);
        // let viewable = this.props.userApp.currentUser.permission.filter(item => item.value == 524288).length > 0;
        // let createable = this.props.userApp.currentUser.permission.filter(item => item.value == 1048576).length > 0;
        // let updateable = this.props.userApp.currentUser.permission.filter(item => item.value == 2097152).length > 0;

        this.state = {
            page: 0,
            size: 20,
            status: 0,
            type: 8,
            data: [],
            total: 0,
            selected: [],
            hospitalId: -1,
            stype: 1,
            queryString: '',
            dataBooking: {},
            progress: false,
            confirmDialog: false,
            tempDelete: [],
            viewable: true,
            createable: true,
            updateable: true,
            modalDetail: false,
            modalAdd: false,
            codeBooking: '',
            listHospital: [],
            isCheckTime: false,
            fromDate: '',
            toDate: '',
        }
    }

    componentWillMount() {
        this.getDetailUser();
        // this.checkTimeDate();
    }

    checkTimeDate() {
        let newDate = new Date().getTime();
        let minDate = Math.floor(newDate / 86400000) * 86400000;
        let maxDate = minDate + 86400000;
        this.state.data.map(item => {
            if (new Date(item.booking.bookingTime).getTime() >= minDate) {
                if (new Date(item.booking.bookingTime).getTime() <= maxDate) {
                    item.isCheckTime = true
                }
            } else {
                item.isCheckTime = false
            }
            return item
        })
    }


    getDetailUser() {
        // let id = (this.props.userApp.currentUser || {}).id;
        // userProvider.getDetail(id).then(s => {
        //     if (s && s.code == 0 && s.data) {
        //         this.setState({
        //             hospitalId: s.data.hospitalByAdmin.id,
        //         })
        //         this.loadPage();
        //     }
        //     this.setState({ progress: false })
        // }).catch(e => {
        //     this.setState({ progress: false })
        // })
    }

    loadPage() {
        this.setState({ progress: true })
        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            status: this.state.status,
            type: this.state.type,
            queryString: this.state.queryString.trim(),
            stype: this.state.stype,
            hospitalId: this.state.hospitalId,
            codeBooking: this.state.codeBooking.trim(),
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
        }
        bookingProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                this.setState({
                    data: s.data.data,
                    stt,
                    total: s.data.total
                })
                this.checkTimeDate();
            } else {
                this.setState({
                    data: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    loadPageDate(event) {
        this.setState({ progress: true })
        if (event == 1) {
            let params = {
                page: this.state.page + 1,
                size: this.state.size,
                status: this.state.status,
                type: this.state.type,
                queryString: this.state.queryString.trim(),
                stype: this.state.stype,
                hospitalId: this.state.hospitalId,
                codeBooking: this.state.codeBooking.trim(),
                fromDate: '',
                toDate: this.state.toDate
            }
            bookingProvider.search(params).then(s => {
                if (s && s.code == 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    this.setState({
                        data: s.data.data,
                        stt,
                        total: s.data.total
                    })
                    this.checkTimeDate();
                } else {
                    this.setState({
                        data: []
                    })
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({ progress: false })
            })
        }
        if (event == 2) {
            let params = {
                page: this.state.page + 1,
                size: this.state.size,
                status: this.state.status,
                type: this.state.type,
                queryString: this.state.queryString.trim(),
                stype: this.state.stype,
                hospitalId: this.state.hospitalId,
                codeBooking: this.state.codeBooking.trim(),
                fromDate: this.state.fromDate,
                toDate: ''
            }
            bookingProvider.search(params).then(s => {
                if (s && s.code == 0 && s.data) {
                    let stt = 1 + (params.page - 1) * params.size;
                    this.setState({
                        data: s.data.data,
                        stt,
                        total: s.data.total
                    })
                    this.checkTimeDate();
                } else {
                    this.setState({
                        data: []
                    })
                }
                this.setState({ progress: false })
            }).catch(e => {
                this.setState({ progress: false })
            })
        }
    }

    getHospital() {
        this.setState({ progress: true })
        let params = {
            page: 1,
            size: 99999,
            active: 1
        }
        hospitalProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [{
                    hospital: {
                        id: -1,
                        name: 'Tất cả'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listHospital: dataTemp,
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }


    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.loadPage()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.loadPage()
        });
    };


    sortName() {
        switch (this.state.type) {
            case 1:
                this.setState({
                    page: 0,
                    type: 2
                }, () => {
                    this.loadPage();
                })
                break;
            case 2:
                this.setState({
                    page: 0,
                    type: 1
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 2
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortServicename() {
        switch (this.state.type) {
            case 3:
                this.setState({
                    page: 0,
                    type: 4
                }, () => {
                    this.loadPage();
                })
                break;
            case 4:
                this.setState({
                    page: 0,
                    type: 3
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 4
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortBookingTime() {
        switch (this.state.type) {
            case 6:
                this.setState({
                    page: 0,
                    type: 5
                }, () => {
                    this.loadPage();
                })
                break;
            case 5:
                this.setState({
                    page: 0,
                    type: 6
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 5
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortDate() {
        switch (this.state.type) {
            case 8:
                this.setState({
                    page: 0,
                    type: 7
                }, () => {
                    this.loadPage();
                })
                break;
            case 7:
                this.setState({
                    page: 0,
                    type: 8
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 7
                }, () => {
                    this.loadPage();
                })
        }
    }


    closeModal() {
        this.loadPage();
        this.setState({ modalAdd: false, modalDetail: false });
    }

    modalDetail(item) {
        this.setState({ modalDetail: true, dataBooking: item, })
    }


    checkin(item) {
        bookingProvider.checkin((item || {}).booking.id).then(s => {
            if (s && s.data && s.code == 0) {
                toast.success("Checkin đặt khám của bệnh nhân thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.setState({ page: 0 });
                this.loadPage();
                
            }
            else {
                toast.error("Checkin đặt khám của bệnh nhân không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
    }
    handleChangeFilter(event, index) {
        if (index == 1) {
            this.setState({
                page: 0,
                queryString: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage();
                }, 500)
            })
        }
        if (index == 3) {
            this.setState({
                page: 0,
                codeBooking: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage();
                }, 500)
            })
        }
        if (index == 2) {
            this.setState({
                page: 0,
                status: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (index == 4) {
            this.setState({
                page: 0,
                hospitalId: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (index == 5) {
            this.setState({
                page: 0,
                fromDate: event
            }, () => {
                this.loadPage();
            })
        }
        if (index == 6) {
            this.setState({
                page: 0,
                toDate: event
            }, () => {
                this.loadPage
                    ();
            })
        }
        if (index == 7) {
            this.setState({
                page: 0,
                fromDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
            }, () => {
                this.loadPage();
            })
        }
        if (index == 9) {
            this.setState({
                page: 0,
                toDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
            }, () => {
                this.loadPage();
            })
        }
    }

    closeDate(event) {
        if (event == 1) {
            this.setState({
                fromDate: ''
            })
        }
        if (event == 2) {
            this.setState({
                toDate: '',
            })
        }
        this.loadPageDate(event);
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { active, queryString, status, toDate, fromDate, codeBooking, hospitalId, listHospital } = this.state;
        return (
            <div style={{ width: "100%", textAlign: "right", marginLeft: 15 }}>
                <div className="searching-booking-code-group">
                    <div className="row">
                        <div className="admin-booking-qrcode">
                            <span className="booking-titile-card">
                                NHẬP MÃ LỊCH ĐẶT KHÁM
            </span>
                            <div className="booking-date-picker">

                                <div className="date-picker-item">

                                    <div className="date-picker-content">
                                        <div className="row">
                                            <div className="col-2">
                                                <img src="/images/icon/date-picker-search.png" alt="" />
                                            </div>
                                            <div className="col-8">
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <DatePicker
                                                        value={fromDate}

                                                        // variant="outlined"

                                                        onChange={(date) => {
                                                            this.setState({ fromDate: date })
                                                            this.handleChangeFilter(date, 7)
                                                        }}
                                                        // onChange={(date) => this.handleChangeFilter(date, 2)}
                                                        leftArrowIcon={<KeyboardArrowLeft />}
                                                        rightArrowIcon={<KeyboardArrowRight />}
                                                        labelFunc={date => isNaN(date) ? "Từ ngày" : moment(date).format('DD-MM-YYYY')}
                                                        maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                                        minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                                    />

                                                </MuiPickersUtilsProvider>

                                            </div>
                                            <div className="col-2">
                                                <img src="/images/icon/date-picker-calendar.png" alt="" />
                                            </div>
                                        </div>

                                        

                                    </div>
                                </div>


                                <div className="date-picker-item">
                                    <div className="date-picker-content">
                                        <div className="row">
                                            <div className="col-2">
                                                <img src="/images/icon/date-picker-search.png" alt="" />
                                            </div>
                                            <div className="col-8">
                                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                                    <DatePicker
                                                        value={toDate}
                                                        minDate={fromDate}
                                                        // variant="outlined"
                                                        onChange={(date) => {
                                                            this.setState({ toDate: date });
                                                            this.handleChangeFilter(date, 9)
                                                        }}
                                                        // onChange={(date) => this.handleChangeFilter(date, 2)}
                                                        leftArrowIcon={<KeyboardArrowLeft />}
                                                        rightArrowIcon={<KeyboardArrowRight />}
                                                        labelFunc={date => isNaN(date) ? "Đến ngày" : moment(date).format('DD-MM-YYYY')}
                                                        maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                                        minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                                    />
                                                </MuiPickersUtilsProvider>

                                            </div>
                                            <div className="col-2">
                                                <img src="/images/icon/date-picker-calendar.png" alt="" />
                                            </div>
                                        </div>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="booking-code-block">
                        <div className="row">
                            <div className="booking-code-input">
                                <img src="/images/icon/Shape.png" alt="" />
                                <TextField
                                    id="outlined-textarea"
                                   
                                    multiline
                                    className={classes.textField}
                                    margin="normal"
                                    // variant="outlined"
                                    value={codeBooking}
                                    onChange={(event) => this.handleChangeFilter(event, 3)}
                                />
                            </div>
                            <span>HOẶC QUÉT QR CODE</span>
                            <div className="qr-code-holder">
                                <img src="/images/icon/QR.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>

                <Grid container spacing={16}>

                    <Grid item xs={12} md={1} className="width-custom">
                        <MuiPickersUtilsProvider utils={MomentUtils} className="picker-date">
                            <DatePicker
                                className="picker-style"
                                value={fromDate}
                                label="Từ ngày"
                                variant="outlined"
                                style={{ marginTop: 17 }}
                                onChange={(date) => {
                                    this.setState({ fromDate: date });
                                    this.handleChangeFilter(date, 7)
                                }}
                                // onChange={(date) => this.handleChangeFilter(date, 2)}
                                leftArrowIcon={<KeyboardArrowLeft />}
                                rightArrowIcon={<KeyboardArrowRight />}
                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                maxDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                                minDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={1} className="width-custom">
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <TimePicker
                                margin="normal"
                                // label="T? gi?"
                                value={fromDate}
                                variant="outlined"
                                onChange={(date) => {
                                    this.setState({ fromDate: date });
                                    this.handleChangeFilter(date, 7)
                                }}
                                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                                style={{ marginRight: 4, marginTop: 17 }}
                                maxDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                                minDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid>
                        <div style={{ marginLeft: -47, marginTop: '10px' }}>
                            <IconButton onClick={() => this.closeDate(1)} color="primary" className={classes.button} aria-label="Loop">
                                <Loop />
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={1} className="width-custom">
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <DatePicker
                                value={toDate}
                                label="Ðến ngày"
                                minDate={fromDate}
                                variant="outlined"
                                style={{ marginTop: 17 }}
                                onChange={(date) => {
                                    this.setState({ toDate: date });
                                    this.handleChangeFilter(date, 9)
                                }}
                                // onChange={(date) => this.handleChangeFilter(date, 2)}
                                leftArrowIcon={<KeyboardArrowLeft />}
                                rightArrowIcon={<KeyboardArrowRight />}
                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                maxDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                                minDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={1} className="width-custom">
                        <div>
                            <IconButton onClick={() => this.closeDate(2)} color="primary" className={classes.button + ' button-date'} aria-label="Loop">
                                <Loop />
                            </IconButton>
                        </div>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <TimePicker
                                margin="normal"
                                // label="Ð?n gi?"
                                value={toDate}
                                variant="outlined"
                                onChange={(date) => {
                                    this.setState({ toDate: date });
                                    this.handleChangeFilter(date, 9)
                                }}
                                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                                style={{ marginRight: 4, marginTop: 17 }}
                                maxDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                                minDateMessage="Ðến ngày không thể nhỏ hon Từ ngày"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs={12} md={2} >
                        <TextField
                            style={{ width: '96%' }}
                            id="outlined-textarea"
                            label="Tên BN / Dịch vụ"
                            placeholder="Tên BN / Dịch vụ"
                            multiline
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            value={queryString}
                            onChange={(event) => this.handleChangeFilter(event, 1)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} >
                        <TextField
                            style={{ width: '96%' }}
                            id="outlined-textarea"
                            label="Mã đặt lịch"
                            placeholder="Mã đặt lịch"
                            multiline
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            value={codeBooking}
                            onChange={(event) => this.handleChangeFilter(event, 3)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} style={{ marginTop: 16, textAlign: 'left' }}>
                        <FormControl className="style-select" variant="outlined">
                            <InputLabel style={{ top: 1, backgroundColor: "#FFFF" }}
                                ref={ref => {
                                    this.InputLabelRef = ref;
                                }}
                                htmlFor="outlined-age-simple"
                            >
                                Trạng thái
                </InputLabel>
                            <Select
                                style={{ width: "100%" }}
                                value={status}
                                onChange={(event) => this.handleChangeFilter(event, 2)}
                                input={
                                    <OutlinedInput
                                        labelWidth={this.state.labelWidth}
                                        name="age"
                                        id="outlined-age-simple"
                                    />
                                }
                            >
                                <MenuItem value={-10}>Tất cả</MenuItem>
                                <MenuItem value={0}>Chờ phục vụ</MenuItem>
                                <MenuItem value={5}>Chờ thanh toán</MenuItem>
                                <MenuItem value={7}>Ðã có hồ so</MenuItem>
                                <MenuItem value={1}>Ðã hủy (không đến)</MenuItem>
                                <MenuItem value={8}>Ðã hủy (không phục vụ)</MenuItem>
                                <MenuItem value={3}>Ðã thanh toán</MenuItem>
                                <MenuItem value={2}>Thanh toán thất bại</MenuItem>
                                <MenuItem value={4}>Thanh toán sau</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
           
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, size, progress, dataBooking, total, stt, viewable, updateable, tempDelete, endTime } = this.state;
        return (
            <div>
                <Paper className={classes.root + ' page-wrapper booking-page head-vender'}>
                    {
                        viewable ?
                            <div className={classes.tableWrapper}>
                                <h2 className="title-page">
                                    DANH SÁCH LỊCH ĐẶT KHÁM ISOFHCare
                                </h2>

                                <Row>
                                    {this.renderChirenToolbar()}
                                </Row>
                                {progress ? <LinearProgress /> : null}
                                <Table aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>HỌ VÀ TÊN
                            <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                    <SortByAlphaIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell style={{ width: "13%" }}>SỐ ĐIỆN THOẠI
                            <IconButton onClick={() => this.sortServicename()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                    <SortByAlphaIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>DỊCH VỤ KHÁM
                            <IconButton onClick={() => this.sortBookingTime()} color="primary" className={classes.button} aria-label="SortIcon">
                                                    <SortIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell style={{ width: "13%" }}>THỜI GIAN</TableCell>
                                            <TableCell>TỔNG TIỀN</TableCell>
                                            <TableCell>TRẠNG THÁI</TableCell>
                                            <TableCell style={{ width: "13%" }}>TRẠNG THÁI CHECKIN
                            <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                                                    <SortIcon />
                                                </IconButton>
                                            </TableCell>
                                            {/* <TableCell>Thao tác</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data && data.length ? data.map((item, index) => {
                                              console.log(data)
                                                return (
                                                 
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        tabIndex={-1}>
                                                        <TableCell onClick={() => this.modalDetail(item)}>{index + stt}</TableCell>
                                                        <TableCell style={{ wordBreak: "break-all" }} onClick={() => this.modalDetail(item)}>{(item.medicalRecords || {}).name}</TableCell>

                                                        <TableCell>
                                                                    {(item.booking || {}).phoneCall}
                                                        </TableCell>


                                                        <TableCell style={{ fontWeight: '700' }} onClick={() => this.modalDetail(item)}>{(item.service || {}).name}</TableCell>
                                                        <TableCell onClick={() => this.modalDetail(item)}>{moment((item.booking || {}).bookingTime).format("LT DD-MM-YYYY")}</TableCell>
                                                        {/* <TableCell onClick={() => this.modalDetail(item)}>
                                                            {(item.booking || {}).statusPay == 1 ? "Ví ISOFH" :
                                                                (item.booking || {}).statusPay == 2 ? "VNPAY" :
                                                                    (item.booking || {}).statusPay == 3 ? "Thanh toán sau t?i CSYT" :
                                                                        (item.booking || {}).statusPay == 4 ? "PAYOO" :
                                                                            (item.booking || {}).statusPay == 5 ? "PAYOO_BILL" : null}

                                                        </TableCell> */}
                                                        <TableCell>{(item.service || {}).price + "đ"}</TableCell>
                                                        <TableCell onClick={() => this.modalDetail(item)}>
                                                            {/* {(item.booking || {}).status == 1 ? "Ðã hủy (không đến)" :
                                                                (item.booking || {}).status == 0 ? "Chờ phục vụ" :
                                                                    (item.booking || {}).status == 2 ? "Thanh toán thất bại" :
                                                                        (item.booking || {}).status == 3 ? "Ðã thanh toán" :
                                                                            (item.booking || {}).status == 4 ? "Thanh toán sau" :
                                                                                (item.booking || {}).status == 5 ? "Chờ thanh toán" :
                                                                                    (item.booking || {}).status == 8 ? "Ðã hủy (không phục vụ)" :
                                                                                        (item.booking || {}).status == 7 ? "Ðã có hồ sơ" : null} */}
                                                            {(item.booking || {}).statusPay = 1 ? "Chưa thanh toán" : "Đã thanh toán"}
                                                        </TableCell>
                                                        {/* <TableCell onClick={() => this.modalDetail(item)}>{(item.booking || {}).reject}</TableCell> */}
                                                        <TableCell>
                                                            
                                                            {/* <Button style={{ textTransform: "capitalize" }} className="check-in" variant="contained" color="inherit" onClick={() => this.checkin(item)}> */}
                                                            {}
                                                            {/* {(item.booking || {}).status == 0 ? "Đã check in" : "Chưa check in"}
                                                             */}
                                                            

                                                            {/* </Button> */}


                                                            {
                                                                (item.booking || {}).status == 0 ?
                                                                        
                                                                    <div>
                                                                        {
                                                                            item.isCheckTime ?
                                                                                <Button style={{ textTransform: "capitalize" }} className="check-in" variant="contained" color="inherit" onClick={() => this.checkin(item)}>Checkin</Button> :
                                                                                <Button style={{ textTransform: "capitalize" }} className="check-in disabled" variant="contained" color="inherit" onClick={() => this.checkin(item)} disabled>Checkin</Button>
                                                                        }
                                                                    </div> : "Chưa check in"
                                                            }
                                                            

                                                        </TableCell>
                                                        {/* <TableCell onClick={() => this.modalDetail(item)}>{moment((item.booking || {}).createdDate).format("DD-MM-YYYY")}</TableCell> */}

                                                        
                                                    </TableRow>
                                                );
                                            })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan="9">{this.state.queryString ? 'Không có kết quả phù hợp' :
                                                        this.state.codeBooking ? 'Không có kết quả phù hợp' :
                                                            this.state.fromDate ? 'Không có kết quả phù hợp' :
                                                                this.state.toDate ? 'Không kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
                            </div>
                            : "Unauthorized error"}
                </Paper>
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn có chắc chắn muốn xóa lịch làm việc của CSYT ra khỏii danh sách?"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
                {this.state.modalDetail && <Detail data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
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
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

export default withStyles(styles)(connect(mapStateToProps)(wordTime));