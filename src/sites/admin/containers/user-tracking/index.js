import React, { Component, Text } from 'react';
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
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import MomentUtils from '@date-io/moment';
import SortIcon from '@material-ui/icons/Sort';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Clear from '@material-ui/icons/Clear';
import Loop from '@material-ui/icons/Loop';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import roleProvider from '../../../../data-access/role-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import userProvider from '../../../../data-access/user-provider';
import userTrackingProvider from '../../../../data-access/user-tracking-provider';
import { red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom'

class UserTracking extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.userApp.currentUser.permission);
    let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 3).length > 0;

    this.state = {
      page: 0,
      size: 20,
      phone: '',
      name: '',
      deviceType: 0,
      fromDate: '',
      toDate: '',
      style: 3,
      totalUser: 0,
      totalMobile: 0,
      totalWeb: 0,
      totalHis: 0,
      totalImport: 0,
      sort: true,
      data: [],
      total: 0,
      labelWidth: 0,
      selected: [{
        id: 0,
        name: "Tất cả"
      }, {
        id: 1,
        name: "MOBILE"
      }, {
        id: 2,
        name: "WEB"
      }],
      statusList: [{
        id: 0,
        name: "Tất cả"
      }, {
        id: 1,
        name: ">=3"
      }, {
        id: 2,
        name: "<3"
      }],
      userStatus: 0,
      userType: 0,
      dataDetail: {},
      progress: false,
      modalAdd: false,
      modalDetailtSpecialist: false,
      confirmDialog: false,
      tempDelete: [],
      viewable
    }
  }

  componentWillMount() {
    this.loadPage();
    // this.loadTotalUser();
  }

  loadTotalUser() {
    userTrackingProvider.totalUser().then(res => {
      if (res && res.code === 0 && res.data) {
        this.setState({
          totalUser: res.data.total,
          totalMobile: res.data.mobile,
          totalWeb: res.data.web,
          totalHis: res.data.his,
          totalImport: res.data.import
        });
        console.log('Hi');
        

      } else {
        this.setState({
          totalUser: 0,
          totalMobile: 0,
          totalWeb: 0,
          totalHis: 0,
          totalImport: 0
        })
      }
    }).catch(e => {
      this.setState({ progress: false })
    });
  }

  loadPage() {
    this.setState({ progress: true })

    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      name: this.state.name.trim(),
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      deviceType: this.state.deviceType === 0 ? "" : (this.state.deviceType === 1 ? "MOBILE" : "WEB"),
      phone: this.state.phone.trim(),
      style: this.state.style,
      userStatus: this.state.userStatus,
      userType: this.state.userType
    }
    userTrackingProvider.search(params).then(s => {
      if (s && s.code == 0 && s.data) {
        let stt = 1 + (params.page - 1) * params.size;
        this.setState({
          data: s.data.users,
          stt,
          total: s.data.total,
          totalMobile: s.data.totalMobile,
          totalWeb: s.data.totalWeb,
          totalHis: s.data.totalHis,
          totalImport: s.data.totalImport
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

  handleChangeFilter(event, action) {
    if (action === 1) {
      this.setState({
        page: 0,
        phone: event.target.value
      }, () => {
        if (this.clearTimeOutAffterRequest) {
          try {
            clearTimeout(this.clearTimeOutAffterRequest);

          } catch (error) {

          }
        }
        this.clearTimeOutAffterRequest = setTimeout(() => {
          this.loadPage()
        }, 500)
      })
    }

    if (action === 2) {
      this.setState({
        page: 0,
        fromDate: moment(event._d).format('YYYY-MM-DD 00:00:00')
      }, () => {
        this.loadPage();
      })
    }
    if (action === 3) {
      this.setState({
        page: 0,
        toDate: moment(event._d).format('YYYY-MM-DD 23:59:59')
      }, () => {
        this.loadPage();
      })
    }

    if (action === 4) {
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
          this.loadPage()
        }, 500)
      })
    }

    if (action === 5) {
      this.setState({
        page: 0,
        deviceType: event.target.value
      }, () => {
        this.loadPage();
      })
    }

    if (action === 6) {
      this.setState({
        page: 0,
        userStatus: event.target.value
      }, () => {
        this.loadPage();
      })
    }

    if (action === 7) {
      this.setState({
        page: 0,
        userType: event.target.value
      }, () => {
        this.loadPage();
      })
    }
  }

  sorting(style) {
    if (style === this.state.style) {
      style = style < 10 ? style + 10 : style - 10;
    }
    this.setState({
      page: 0,
      style: style
    }, () => {
      this.loadPage();
    })
  }

  renderChirenToolbar() {
    const { classes } = this.props;
    const {
      toDate,
      fromDate,
      phone,
      name,
      deviceType,
      total,
      totalWeb,
      totalMobile,
      userStatus,
      userType,
      totalHis,
      totalImport
    } = this.state;
    return (
      <div className="tool-bar-booking">
        <Grid container spacing={16}>
          <Grid item xs={12} md={10}>
            <h3>
              Tổng số user(khởi tạo):{" "}
              <span style={{ color: red }}>{total}</span>
            </h3>
          </Grid>
          <Grid item xs={12} md={2}>
            <h3>
              Mobile:{" "}
              <span style={{ color: red }}>{totalMobile}</span>
            </h3>
            <h3>
              Website:{" "}
              <span style={{ color: red }}>{totalWeb}</span>
            </h3>
            <h3>
              HIS: <span style={{ color: red }}>{totalHis}</span>
            </h3>
            <h3>
              Import: <span style={{ color: red }}>{totalImport}</span>
            </h3>
          </Grid>

          <Grid item xs={12} md={2} style={{ marginTop: -17 }}>
            <TextField
              id="outlined-textarea"
              label="Số điện thoại "
              placeholder="Số điện thoại"
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={phone}
              onChange={event => this.handleChangeFilter(event, 1)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                value={fromDate}
                label="Từ ngày"
                variant="outlined"
                onChange={date => {
                  this.setState({ fromDate: date });
                  this.handleChangeFilter(date, 2);
                }}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                labelFunc={date =>
                  isNaN(date)
                    ? "Chọn ngày"
                    : moment(date).format("DD-MM-YYYY")
                }
                maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} md={1}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                value={toDate}
                label="Đến ngày"
                minDate={fromDate}
                variant="outlined"
                onChange={date => {
                  this.setState({ toDate: date });
                  this.handleChangeFilter(date, 3);
                }}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                labelFunc={date =>
                  isNaN(date)
                    ? "Chọn ngày"
                    : moment(date).format("DD-MM-YYYY")
                }
                maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} md={2} style={{ marginTop: -17 }}>
            <TextField
              id="outlined-textarea"
              label="Tên tài khoản"
              placeholder="Tên tài khoản"
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={name}
              onChange={event => this.handleChangeFilter(event, 4)}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <FormControl
              variant="outlined"
              className={classes.formControl + " litmit-select"}
            >
              <InputLabel
                style={{ top: 2, backgroundColor: "#FFF" }}
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Trên thiết bị
                  </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                value={deviceType}
                onChange={event =>
                  this.handleChangeFilter(event, 5)
                }
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="age"
                    id="outlined-age-simple"
                  />
                }
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Mobile</MenuItem>
                <MenuItem value={2}>Web</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={1}>
            <FormControl
              variant="outlined"
              className={classes.formControl + " litmit-select"}
            >
              <InputLabel
                style={{ top: 2, backgroundColor: "#FFF" }}
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Tổng hành vi
                  </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                value={userStatus}
                onChange={event =>
                  this.handleChangeFilter(event, 6)
                }
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="age"
                    id="outlined-age-simple"
                  />
                }
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>&gt;=3</MenuItem>
                <MenuItem value={2}>&lt;3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={1}>
            <FormControl
              variant="outlined"
              className={classes.formControl + " litmit-select"}
            >
              <InputLabel
                style={{ top: 2, backgroundColor: "#FFF" }}
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Loại tài khoản
                  </InputLabel>
              <Select
                style={{ textAlign: "left" }}
                value={userType}
                onChange={event =>
                  this.handleChangeFilter(event, 7)
                }
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="age"
                    id="outlined-age-simple"
                  />
                }
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Đăng ký trên mobile</MenuItem>
                <MenuItem value={2}>Đăng ký trên web</MenuItem>
                <MenuItem value={3}>HIS YKHN</MenuItem>
                <MenuItem value={4}>HIS BVE</MenuItem>
                <MenuItem value={7}>Import</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    );
  }

  convertAccountSource(accountSource) {
    if (accountSource === 'HIS_YKHN')
      return 'Đăng ký tại YKHN';
    if (accountSource === 'HIS_BVE')
      return 'Đăng ký tại BVE';
    if (accountSource === 'REGISTER_MOBILE')
      return 'Đăng ký trên mobile';
    if (accountSource === 'REGISTER_WEB')
      return 'Đăng ký trên mobile';
    if (accountSource === "IMPORT")
      return "Import excel";
  }

  render() {
    const { classes } = this.props;
    const { data, page, size, total, progress, stt, viewable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page special-page'}>
          {
            viewable ?
              <div className={classes.tableWrapper}>
                <div className="link-user-tracking-group">
                  <Link to="/admin/user-tracking">
                    <span style={{ color: 'black', borderBottom: '1px' }} className="title-page-user-tracking">
                      User tracking
                </span>
                  </Link><span>|</span>
                  <Link to="/admin/import-user"><span className="title-page-user-tracking">
                    Import người dùng từ file excel
                </span></Link>
                </div>
                
                <EnhancedTableToolbar
                  title=""
                  numSelected={0}
                  actionsChiren={
                    this.renderChirenToolbar()
                  }
                />
                {progress ? <LinearProgress /> : null}
                <div className="table-wrapper">
                  <Table aria-labelledby="tableTitle">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Số điện thoại
                                                    <IconButton onClick={() => this.sorting(1)} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell style={{ width: "10%" }}>
                          Tên tài khoản
                                                        <IconButton onClick={() => this.sorting(2)} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Ngày sử dụng
                                                <IconButton onClick={() => this.sorting(3)} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Loại tài khoản</TableCell>
                        <TableCell>Giới tính</TableCell>
                        <TableCell>Tuổi</TableCell>
                        <TableCell>Trên thiết bị(Device)</TableCell>
                        <TableCell>Chi tiết Device(Os)</TableCell>
                        <TableCell>App version</TableCell>
                        <TableCell>Ngày cập nhật cuối
                                                    <IconButton onClick={() => this.sorting(5)} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Hành vi cuối cùng</TableCell>
                        <TableCell>Tổng số hành vi</TableCell>
                        <TableCell style={{ width: "5%" }}>Tổng đơn hàng giao dịch</TableCell>
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
                              <TableCell>{index + stt}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.phone}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.fullName}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{moment(item.user.createdDate).format('DD/MM/YYYY HH:MM:ss')}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{this.convertAccountSource(item.user_tracking.accountSource)}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.gender === 1 ? 'Nam' : 'Nữ'}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.age}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.deviceInfo.deviceType}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.deviceInfo.deviceOs}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.appVersion}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.lastUsing}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.lastAction}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.totalAction == null ? 0 : item.user_tracking.totalAction}</TableCell>
                              <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.totalTransaction}</TableCell>
                            </TableRow>
                          );
                        })
                          :
                          <TableRow>
                            <TableCell>{this.state.name ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
  },
});

export default withStyles(styles)(connect(mapStateToProps)(UserTracking));