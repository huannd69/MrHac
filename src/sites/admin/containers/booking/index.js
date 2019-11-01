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
import userProvider from '../../../../data-access/user-provider';
import { withStyles } from '@material-ui/core/styles';
import DetailBooking from './detail-booking';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import hospitalProvider from '../../../../data-access/hospital-provider';
import RejectPost from './reject-booking';
import CancelPost from './cancel-booking';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import { Col, Row } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Clear from '@material-ui/icons/Clear';
import Loop from '@material-ui/icons/Loop';
import ModalAddUpdate from './create-update-booking';

class wordTime extends Component {
  constructor(props) {
    super(props);
    let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 536870912).length > 0;
    let updateable = this.props.userApp.currentUser.permission.filter(item => item.value == 2147483648).length > 0;
    // let createable = this.props.userApp.currentUser.permission.filter(item => item.value == 1048576).length > 0;
    let canceleable = this.props.userApp.currentUser.permission.filter(item => item.value == 1073741824).length > 0;
    let confirmable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 268435456).length > 0;

    this.state = {
      page: 0,
      size: 20,
      status: [],
      checkStatus: [],
      type: 8,
      data: [],
      total: 0,
      selected: [],
      hospitalId: -1,
      stype: 2,
      queryString: '',
      codeBooking: '',
      dataBooking: {},
      progress: false,
      confirmDialog: false,
      tempDelete: [],
      viewable,
      createable: true,
      updateable,
      modalDetail: false,
      modalAdd: false,
      confirmable,
      canceleable,
      modalReject: false,
      modalApproval: false,
      name: [],
      stt: '',
      fromDate: '',
      toDate: '',
      statusCheck: [],
      listStatus: [],
      error: true,
      errorPage: true,
      modalCancel: false,
      isCheckFromDate: true,
      isCheckToDate: true,
      statusPay: -10
    }
  }


  componentWillMount() {
    this.handleChangePageCheck();
    this.listHospital();
  }


  loadPage = () => {
    this.setState({ progress: true })
    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      status: this.state.status,
      statusPay: this.state.statusPay,
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
    if (event == 1) {
      this.setState({ progress: true })
      let params = {
        page: this.state.page + 1,
        size: this.state.size,
        status: this.state.status,
        statusPay: this.state.statusPay,
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
      this.setState({ progress: true })
      let params = {
        page: this.state.page + 1,
        size: this.state.size,
        status: this.state.status,
        statusPay: this.state.statusPay,
        type: this.state.type,
        queryString: this.state.queryString.trim(),
        stype: this.state.stype,
        hospitalId: this.state.hospitalId,
        codeBooking: this.state.codeBooking.trim(),
        fromDate: this.state.fromDate,
        toDate: '',
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

  listHospital() {
    let params = {
      page: 1,
      size: 9999,
      active: 1,
      type: 3,
      availableBooking: 1
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

  handleChangePage = (event, action) => {
    this.setState({
      page: action,
      selected: [],
    }, () => {
      this.handleChangePageCheck()
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ size: event.target.value }, () => {
      this.handleChangePageCheck()
    });
  };

  handleChangePageCheck(event) {
    const { name } = this.state;
    let status = []
    if (name.length == 0) {
      status.push('');
    } else {
      for (let i = 0; i < name.length; i++) {
        if (name[i].toString().replace("Chờ phục vụ", "Chờphụcvụ") == "Chờphụcvụ") {
          status.push('0');
        }
        else if (name[i].toString().replace("Chờ thanh toán", "Chờthanhtoán") == "Chờthanhtoán") {
          status.push('5');
        }
        else if (name[i].toString().replace("Đã có hồ sơ", "Đãcóhồsơ") == "Đãcóhồsơ") {
          status.push('7');
        }
        else if (name[i].toString().replace("Đã hủy (không đến)", "Đãhủykhôngđến") == "Đãhủykhôngđến") {
          status.push('1');
        }
        else if (name[i].toString().replace("Đã hủy (không phục vụ)", "Đãhủykhôngphụcvụ") == "Đãhủykhôngphụcvụ") {
          status.push('8');
        }
        else if (name[i].toString().replace("Đã thanh toán", "Đãthanhtoán") == "Đãthanhtoán") {
          status.push('3');
        }
        else if (name[i].toString().replace("Thanh toán thất bại", "Thanhtoánthấtbại") == "Thanhtoánthấtbại") {
          status.push('2');
        }
        else if (name[i].toString().replace("Thanh toán sau", "Thanhtoánsau") == "Thanhtoánsau") {
          status.push('4');
        }

      }
    }
    this.setState({
      statusCheck: status,
      status
    }, this.loadPage
    );


  };

  handleChangeCloseDate(event) {
    const { name } = this.state;
    let status = []
    if (name.length == 0) {
      status.push('');
    } else {
      for (let i = 0; i < name.length; i++) {
        if (name[i].toString().replace("Chờ phục vụ", "Chờphụcvụ") == "Chờphụcvụ") {
          status.push('0');
        }
        else if (name[i].toString().replace("Chờ thanh toán", "Chờthanhtoán") == "Chờthanhtoán") {
          status.push('5');
        }
        else if (name[i].toString().replace("Đã có hồ sơ", "Đãcóhồsơ") == "Đãcóhồsơ") {
          status.push('7');
        }
        else if (name[i].toString().replace("Đã hủy (không đến)", "Đãhủykhôngđến") == "Đãhủykhôngđến") {
          status.push('1');
        }
        else if (name[i].toString().replace("Đã hủy (không phục vụ)", "Đãhủykhôngphụcvụ") == "Đãhủykhôngphụcvụ") {
          status.push('8');
        }
        else if (name[i].toString().replace("Đã thanh toán", "Đãthanhtoán") == "Đãthanhtoán") {
          status.push('3');
        }
        else if (name[i].toString().replace("Thanh toán thất bại", "Thanhtoánthấtbại") == "Thanhtoánthấtbại") {
          status.push('2');
        }
        else if (name[i].toString().replace("Thanh toán sau", "Thanhtoánsau") == "Thanhtoánsau") {
          status.push('4');
        }
      }
    }
    this.setState({
      statusCheck: status,
      status
    }, () => this.loadPageDate(event)
    )
  };

  sortName() {
    switch (this.state.type) {
      case 1:
        this.setState({
          page: 0,
          type: 2
        }, () => {
          this.handleChangePageCheck();
        })
        break;
      case 2:
        this.setState({
          page: 0,
          type: 1
        }, () => {
          this.handleChangePageCheck();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 2
        }, () => {
          this.handleChangePageCheck();
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
          this.handleChangePageCheck();
        })
        break;
      case 4:
        this.setState({
          page: 0,
          type: 3
        }, () => {
          this.handleChangePageCheck();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 4
        }, () => {
          this.handleChangePageCheck();
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
          this.handleChangePageCheck();
        })
        break;
      case 5:
        this.setState({
          page: 0,
          type: 6
        }, () => {
          this.handleChangePageCheck();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 5
        }, () => {
          this.handleChangePageCheck();
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
          this.handleChangePageCheck();
        })
        break;
      case 7:
        this.setState({
          page: 0,
          type: 8
        }, () => {
          this.handleChangePageCheck();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 7
        }, () => {
          this.handleChangePageCheck();
        })
    }
  }


  closeModal() {
    this.handleChangePageCheck();
    this.setState({ modalAdd: false, modalDetail: false, modalApproval: false, modalReject: false, modalCancel: false });
  }

  modalDetail(item) {
    this.setState({ modalDetail: true, dataBooking: item, })
  }

  modalCheckin(item) {
    this.setState({ modalCheckin: true, dataBooking: item, })
  }


  modalApproval(item) {
    if (this.state.confirmable) {
      this.setState({
        modalApproval: true,
        dataBooking: item
      })
      this.reject(item);
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  modalReject(item) {
    if (this.state.confirmable) {
      this.setState({
        modalReject: true,
        dataBooking: item
      })
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  modalCancel(item) {
    if (this.state.canceleable) {
      this.setState({
        modalCancel: true,
        dataBooking: item
      })
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  reject = (item) => {
    // this.setState({ confirmDialog: false })
    // if (type == 1) {
    // const {  dataBooking, reject } = this.state;
    this.setState({
      statusCheck: this.state.status
    });
    let object = {
      status: 6,
      reject: "",
      type: 1
    }
    bookingProvider.approved(item.booking.id, object).then(s => {
      if (s && s.code == 0) {
        toast.success("Xác nhận đặt khám của bệnh nhân thành công!", {
          position: toast.POSITION.TOP_RIGHT
        });
        this.setState({
          status: this.state.statusCheck
        });
        this.handleChangePageCheck();
        this.handleClose();
      } else {
        toast.error("Xác nhận đặt khám của bệnh nhân không thành công!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }).catch(e => {
    })

    // }
  }

  closeDate(event) {
    if (event == 1) {
      this.setState({
        fromDate: ''
      })
    }
    if (event == 2) {
      this.setState({
        toDate: ''
      })
    }
    this.handleChangeCloseDate(event);
  }

  closeToDate() {
    this.setState({
      toDate: '',
      isCheckToDate: false
    })
    if (this.state.isCheckToDate) {
      return;
    } else {
      this.handleChangePageCheck();
    }

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
          this.handleChangePageCheck();
        }, 500)
      })
    }
    if (index == 4) {
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
          this.handleChangePageCheck();
        }, 500)
      })
    }
    if (index == 2) {
      this.setState({
        page: 0,
        status: event.target.value
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 3) {
      this.setState({
        page: 0,
        hospitalId: event.target.value
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 5) {
      this.setState({
        page: 0,
        fromDate: event
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 6) {
      this.setState({
        page: 0,
        toDate: event
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 7) {
      this.setState({
        page: 0,
        fromDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 9) {
      this.setState({
        page: 0,
        toDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
      }, () => {
        this.handleChangePageCheck();
      })
    }
    if (index == 10) {
      this.setState({
        page: 0,
        statusPay: event.target.value
      }, () => {
        this.handleChangePageCheck();
      })
    }

  }

  handleChange = event => {
    if (event.target.value.length >= 0) {
      this.setState({
        status: []
      })
      if (this.state.status.length == 0) {
        this.setState({
          error: false
        })
      }
    }
    if (this.state.error) {
      return;
    } else {
      this.handleChangeCheck(event);
    }
  }

  modalCreateUpdate(item) {
    if (item) {
      if (this.state.updateable) {
        this.setState({
          modalAdd: true,
          dataBooking: item,
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } else {
      if (this.state.createable) {
        this.setState({
          modalAdd: true,
          dataBooking: {},
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  }

  handleChangeCheck(event) {
    // const { status } = this.state;
    this.setState({
      name: event.target.value
    })
    let status = []
    if (event.target.value.length == 0) {
      status.push('');
    } else {
      for (let i = 0; i < event.target.value.length; i++) {
        if (event.target.value[i].toString().replace("Chờ phục vụ", "Chờphụcvụ") == "Chờphụcvụ") {
          status.push('0');
        }
        else if (event.target.value[i].toString().replace("Chờ thanh toán", "Chờthanhtoán") == "Chờthanhtoán") {
          status.push('5');
        }
        else if (event.target.value[i].toString().replace("Đã có hồ sơ", "Đãcóhồsơ") == "Đãcóhồsơ") {
          status.push('7');
        }
        else if (event.target.value[i].toString().replace("Đã hủy (không đến)", "Đãhủykhôngđến") == "Đãhủykhôngđến") {
          status.push('1');
        }
        else if (event.target.value[i].toString().replace("Đã hủy (không phục vụ)", "Đãhủykhôngphụcvụ") == "Đãhủykhôngphụcvụ") {
          status.push('8');
        }
        else if (event.target.value[i].toString().replace("Đã thanh toán", "Đãthanhtoán") == "Đãthanhtoán") {
          status.push('3');
        }
        else if (event.target.value[i].toString().replace("Thanh toán thất bại", "Thanhtoánthấtbại") == "Thanhtoánthấtbại") {
          status.push('2');
        }
        else if (event.target.value[i].toString().replace("Thanh toán sau", "Thanhtoánsau") == "Thanhtoánsau") {
          status.push('4');
        }
      }
    }
    this.setState({
      statusCheck: status,
      status
    }, this.loadPage
    );

  };
  handleKeyPress = () => {
    this.loadPage();
  }

  renderChirenToolbar() {
    const { classes } = this.props;
    const { active, queryString, toDate, fromDate, listHospital, hospitalId, codeBooking, statusPay } = this.state;
    return (
      <div className="tool-bar-booking" style={{ width: "100%", textAlign: "right", marginTop: -50, marginLeft: -50 }}>
        <Grid
          style={{ paddingLeft: 80 }}
          container
          spacing={16}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* <Grid item xs={12} md={1} >
            <p style={{ textAlign: 'right', fontSize: 15 }}>Giờ hẹn</p>
          </Grid> */}
          <Grid style={{ marginRight: 15 }} item xs={12} md={1}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                value={fromDate}
                label="Từ ngày"
                variant="outlined"
                style={{ marginTop: 17, width: "110%", marginLeft: -7 }}
                onChange={(date) => {
                  this.setState({ fromDate: date });
                  this.handleChangeFilter(date, 7)
                }}
                // onChange={(date) => this.handleChangeFilter(date, 2)}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={1}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <TimePicker
                margin="normal"
                label="Từ giờ"
                value={fromDate}
                variant="outlined"
                maxDate={toDate}
                onChange={(date) => {
                  this.setState({ fromDate: date });
                  this.handleChangeFilter(date, 7)
                }}
                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                style={{ marginLeft: -3, marginTop: 17 }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid>
            <div style={{ marginLeft: -42, marginTop: 13 }}>
              <IconButton onClick={() => this.closeDate(1)} color="primary" className={classes.button} aria-label="Loop">
                <Loop />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={12} md={1} style={{ marginLeft: '-0.5%' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                value={toDate}
                label="Đến ngày"
                minDate={fromDate}
                variant="outlined"
                style={{ marginTop: 17, width: "110%" }}
                onChange={(date) => {
                  this.setState({ toDate: date });
                  this.handleChangeFilter(date, 9)
                }}
                // onChange={(date) => this.handleChangeFilter(date, 2)}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={1}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <TimePicker
                margin="normal"
                label="Đến giờ"
                value={toDate}
                minDate={fromDate}
                variant="outlined"
                onChange={(date) => {
                  this.setState({ toDate: date });
                  this.handleChangeFilter(date, 9)
                }}
                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                style={{ marginLeft: 5, width: '110%', marginTop: 17 }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid>
            <div style={{ marginLeft: -30, marginTop: 13 }}>
              <IconButton onClick={() => this.closeDate(2)} color="primary" className={classes.button} aria-label="Loop">
                <Loop />
              </IconButton>
            </div>
          </Grid>
          <Grid className="custom-width" item xs={12} md={1} style={{ marginLeft: "-1%" }}>
            <TextField
              style={{ width: '170%' }}
              id="outlined-textarea"
              label="Tên BN / Dịch vụ"
              placeholder="Tên BN / Dịch vụ"
              // multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={queryString}
              onChange={(event) => this.handleChangeFilter(event, 1)}
              onKeyPress={() => this.handleKeyPress()}
            />
          </Grid>
          <Grid className="custom-width1" item xs={12} md={1} style={{ marginLeft: "4.5%" }}>
            <TextField
              style={{ width: '127%' }}
              id="outlined-textarea"
              label="Mã đặt lịch"
              placeholder="Mã đặt lịch"
              // multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={codeBooking}
              onChange={(event) => this.handleChangeFilter(event, 4)}
              onKeyPress={() => this.handleKeyPress()}
            />
          </Grid>
          <Grid item xs={12} md={1} style={{ marginLeft: '1.5%', marginTop: 8 }}>
            <FormControl variant="outlined" className={classes.formControl + ' litmit-select'}>
              <InputLabel style={{ top: 2, backgroundColor: "#FFF" }}
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                CSYT
                </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                value={hospitalId}
                onChange={(event) => this.handleChangeFilter(event, 3)}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="age"
                    id="outlined-age-simple"
                  />
                }
              >
                {
                  listHospital && listHospital.length ? listHospital.map((option, index) =>
                    <MenuItem key={index} value={option.hospital.id}>{option.hospital.name}</MenuItem>
                  ) : null
                }
              </Select>
            </FormControl>
          </Grid>


        </Grid>
        <Grid

          container
          spacing={1}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} md={3} style={{ marginLeft: 10 }}>
            <FormControl style={{ marginLeft: 20 }} variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-simple">Hình thức thanh toán</InputLabel>
              <Select
                value={statusPay}
                onChange={(event) => this.handleChangeFilter(event, 10)}
                variant="outlined"
              >
                <MenuItem value={-10}>Tất cả</MenuItem>
                <MenuItem value={0}>Chưa chọn dịch vụ</MenuItem>
                <MenuItem value={1}>Ví ISOFH</MenuItem>
                <MenuItem value={2}>VNPAY</MenuItem>
                <MenuItem value={3}>Thanh toán sau tại CSYT</MenuItem>
                <MenuItem value={4}>PAYOO</MenuItem>
                <MenuItem value={5}>PAYOO_BILL</MenuItem>
                <MenuItem value={6}>Chuyển khoản trực tiếp</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} style={{ marginLeft: "0.5%" }}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-chip">Trạng thái</InputLabel>
              <Select
                multiple
                value={this.state.name}
                onChange={this.handleChange}
                input={<Input value="select-multiple-chip" />}
                variant="outlined"
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}

                  </div>
                )}
                MenuProps={MenuProps}
              >
                {listStatus.map(name => (
                  <MenuItem key={name.name} value={name.name} style={getStyles(name.name, this)}>
                    {name.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

        </Grid>

        {/* <TextField
              style={{ marginLeft: 28, marginTop: "1.3%"}}
              id="datetime-local"
              label="Từ"
              type="datetime-local"
              variant="outlined"
              defaultValue=""
              className={classes.textField}
              onChange={(e) => { 
                let date = new Date(e.target.value);
                this.setState({ fromDate: date }) ;
                this.handleChangeFilter(date, 5)
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ marginTop: "1.3%"}}
              id="datetime-local"
              label="Đến"
              type="datetime-local"
              variant="outlined"
              defaultValue=""
              minDate={fromDate}
              className={classes.textField}
              onChange={(e) => { 
                let date = new Date(e.target.value);
                this.setState({ toDate: date }) ;
                this.handleChangeFilter(date, 6)
              }}
              InputLabelProps={{
                shrink: true,
              }} */}
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { data, page, size, progress, stt, status, dataBooking, total, viewable, updateable, canceleable, endTime, confirmable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page'}>
          {
            viewable ?
              <div className={classes.tableWrapper}>
                <h2 className="title-page">
                  Quản lý đặt khám
                </h2>
                <EnhancedTableToolbar
                  title=""
                  numSelected={0}
                //   actionsChiren={
                //     this.renderChirenToolbar()
                // }
                />
                <Row>
                  {this.renderChirenToolbar()}
                </Row>
                {progress ? <LinearProgress /> : null}
                <div className='table-wrapper'>
                  <Table aria-labelledby="tableTitle">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên BN
                            <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell style={{ width: "13%" }}>Dịch vụ
                            <IconButton onClick={() => this.sortServicename()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Giờ hẹn
                            <IconButton onClick={() => this.sortBookingTime()} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell style={{ width: "13%" }}>Hình thức thanh toán</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Lý do hủy</TableCell>
                        <TableCell>CSYT</TableCell>
                        <TableCell style={{ width: "13%" }}>Ngày tạo
                            <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data && data.length ? data.map((item, index) => {
                          {/* console.log(data); */ }
                          return (
                            <TableRow
                              hover
                              key={index}
                              tabIndex={-1}>
                              {/* {console.log(item)} */}
                              <TableCell onClick={() => this.modalDetail(item)}>{index + stt}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }} onClick={() => this.modalDetail(item)}>{(item.medicalRecords || {}).name}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{(item.author || {}).phone}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{(item.services[0] || {}).name}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{moment((item.booking || {}).bookingTime).format("LT  DD-MM-YYYY")}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>
                                {(item.booking || {}).statusPay == 1 ? "Ví ISOFH" :
                                  (item.booking || {}).statusPay == 2 ? "VNPAY" :
                                    (item.booking || {}).statusPay == 3 ? "Thanh toán sau tại CSYT" :
                                      (item.booking || {}).statusPay == 4 ? "PAYOO" :
                                        (item.booking || {}).statusPay == 5 ? "PAYOO_BILL" :
                                          (item.booking || {}).statusPay == 6 ? "Chuyển khoản trực tiếp" : null}
                              </TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>
                                {(item.booking || {}).status == 1 ? "Đã hủy (không đến)" :
                                  (item.booking || {}).status == 0 ? "Chờ phục vụ" :
                                    (item.booking || {}).status == 2 ? "Thanh toán thất bại" :
                                      (item.booking || {}).status == 3 ? "Đã thanh toán" :
                                        (item.booking || {}).status == 4 ? "Thanh toán sau" :
                                          (item.booking || {}).status == 5 ? "Chờ thanh toán" :
                                            (item.booking || {}).status == 7 ? "Đã có hồ sơ" :
                                              (item.booking || {}).status == 8 ? "Đã hủy (không phục vụ)" : null}
                              </TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{(item.booking || {}).reject}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{(item.hospital || {}).name}</TableCell>
                              <TableCell onClick={() => this.modalDetail(item)}>{moment((item.booking || {}).createdDate).format("DD-MM-YYYY")}</TableCell>
                              <TableCell>
                                {
                                  updateable && ((item.booking || {}).status == 3 || (item.booking || {}).status == 4) ?
                                    <Tooltip title="Sửa đặt khám">
                                      <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="EditIcon">
                                        <img alt="" src="/images/icon/edit1.png" />
                                      </IconButton>
                                    </Tooltip>
                                    : null
                                }
                                {
                                  confirmable && ((item.booking || {}).status == 3 || (item.booking || {}).status == 4 || (item.booking || {}).status == 5) ?
                                    <Tooltip title="Từ chối đặt khám">
                                      <IconButton onClick={() => this.modalReject(item)} color="primary" className={classes.button} aria-label="CloseIcon">
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                    : null
                                }

                                {/* {
                                  confirmable && (item.booking || {}).status == 4 ?
                                    <div>

                                      <Tooltip title="Xác nhận đặt khám">
                                        <IconButton onClick={() => this.modalApproval(item)} color="primary" className={classes.button} aria-label="CheckIcon">
                                          <CheckIcon />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Từ chối đặt khám">
                                        <IconButton onClick={() => this.modalReject(item)} color="primary" className={classes.button} aria-label="CloseIcon">
                                          <CloseIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </div> : null
                                } */}


                                {
                                  canceleable && (item.booking || {}).status == 0 ?
                                    <div>
                                      <Tooltip title="Hủy đặt khám">
                                        <IconButton onClick={() => this.modalCancel(item)} color="primary" className={classes.button} aria-label="CancelIcon">
                                          <CancelIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </div> : null
                                }


                              </TableCell>


                            </TableRow>
                          );
                        })
                          :
                          <TableRow>
                            <TableCell>{this.state.queryString ? 'Không có kết quả phù hợp' :
                              this.state.codeBooking ? 'Không có kết quả phù hợp' :
                                this.state.fromDate ? 'Không có kết quả phù hợp' :
                                  this.state.toDate ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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

              </div>
              : "Unauthorized error"}
        </Paper>
        {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn có chắc chắn muốn xóa  lịch làm việc của CSYT ra khỏi danh sách?"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
        {this.state.modalDetail && <DetailBooking data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalCancel && <CancelPost data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalReject && <RejectPost data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalAdd && <ModalAddUpdate data={dataBooking} callbackOff={this.closeModal.bind(this)} />}

        {/* {this.state.modalAdd && <ModalAddUpdate history={this.props.history} data={dataBooking} callbackOff={this.closeModal.bind(this)} />} */}
      </div>
    );
  }
}

const listStatus = [
  {
    name: 'Chờ phục vụ',
    value: 0
  },
  {
    name: 'Chờ thanh toán',
    value: 5
  },
  {
    name: 'Đã có hồ sơ',
    value: 7
  },
  {
    name: 'Đã hủy (không đến)',
    value: 1
  },
  {
    name: 'Đã hủy (không phục vụ)',
    value: 8
  },
  {
    name: 'Đã thanh toán',
    value: 3
  },
  {
    name: 'Thanh toán thất bại',
    value: 2
  },
  {
    name: 'Thanh toán sau',
    value: 4
  },
];

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.name.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
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
    display: 'flex',
    flexWrap: 'wrap',
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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
});


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(wordTime));