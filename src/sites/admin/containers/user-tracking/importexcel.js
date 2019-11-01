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
import uploadProvider from '../../../../data-access/upload-provider';
import { red } from '@material-ui/core/colors';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ModalAddUpdate from './create-update-user';
import ModalDetailtUser from './detail-user';
import { ExcelFile, ExcelSheet } from "react-data-export";
import ReactExport from "react-data-export";


class ImportUser extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.userApp.currentUser.permission);
    let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 3).length > 0;
    let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 32).length > 0;
    let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 64).length > 0;

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
      sort: true,
      data: [],
      total: 0,
      labelWidth: 0,
      action: 7,
      dataUser: {},
      sourceImportFileName: '',
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
      selectedFile: null,
      warningfiletype: '',
      successrowcount: 0,
      errorrowcount: 0,
      errorRow: [],
      successRows: [],
      fileholder: '',
      listGender: [{
        gender: {
          id: -1,
          name: '--- Chọn giới tính ---'
        }
      }, {
        gender: {
          id: 1,
          name: 'Nam'
        }
      }, {
        gender: {
          id: 0,
          name: 'Nữ'
        },
      }, {
        gender: {
          id: 2,
          name: 'Không xác định'
        }
      }],
      modalDetailtUser: false,
      viewable,
      createable,
      updateable

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
          totalHis: res.data.his
        })

      } else {
        this.setState({
          totalUser: 0,
          totalMobile: 0,
          totalWeb: 0,
          totalHis: 0
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
      sourceImportFileName: this.state.sourceImportFileName,
      userType: 7
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
          dataUser: s.data,
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

  modalCreateUpdate(item) {
    if (item) {
      if (this.state.updateable) {
        this.setState({
          modalAdd: true,
          dataUser: item,
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
          dataUser: {},
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  }

  modalDetailUser(item) {
    if (this.state.viewable) {
      this.setState({ modalDetailtUser: true, dataUser: item, })
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  closeModal() {
    this.loadPage();
    this.setState({ modalAdd: false, modalDetailtUser: false });
  }

  handleChangeFilter(event, action) {
    if (action === 1) {
      this.setState({
        page: 0,
        phone: event.target.value,

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
        userType: 7
      }, () => {
        this.loadPage();
      })
    }
    if (action === 8) {
      this.setState({
        page: 0,
        sourceImportFileName: event.target.value
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


  handleImportFile = (event) => {
    this.setState({
      fileholder: event.target.files[0].name
    })
    uploadProvider.importfile(event.target.files[0]).then(s => {
      if (s && s.data && s.data.code == 0) {
        this.setState({
          warningfiletype: '',
          successrowcount: s.data.data.successRows.length,
          errorrowcount: s.data.data.errorRow.length,
          errorRow: s.data.data.errorRow,
          successRows: s.data.data.successRows,
          importdata: s.data
        }, () => {
          this.loadPage();
        })

        console.log(s.data);
        toast.success("Số tài khoản được import thành công:" + " " + this.state.successrowcount.toString(), {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000

        });
        toast.warn(
          <div>
            Số tài khoản không hợp lệ: {this.state.errorrowcount.toString()} <br />
            Download file báo cáo để xem chi tiết.
          </div>,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
          });



      }
      else {
        console.log(s.data);
        toast.error("Vui lòng thử lại !", {
          position: toast.POSITION.TOP_LEFT
        });
        this.setState({
          warningfiletype: '(Cảnh báo: File excel (.xls) tải lên không đúng định dạng)',
          successrowcount: 0,
          errorrowcount: 0,
        })
      }
    }).catch(e => {
      toast.error("Lỗi!", {
        position: toast.POSITION.TOP_LEFT
      });
      console.log(e);

    })
    document.getElementById('excel-file').value = '';


  }


  renderChirenToolbar() {
    const { classes } = this.props;
    const { data, page, size, progress, stt, viewable, updateable } = this.state;
    const { toDate, fromDate, phone, name, deviceType, total, totalWeb, totalMobile, userStatus, userType, totalHis, sourceImportFileName } = this.state;


    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

    const fileNameSplited = this.state.fileholder.split('.')[0];


    const map1 = this.state.errorRow.map((item, index) => [index + 1, item.split(':', 1)[0], item.split(':', 7)[2]]);


    const multidataset = [
      {
        columns: ["STT", "Dòng", "Mô tả lỗi"],
        data: map1

      }
    ]



    return (
      <div className="children-toolbar">
        <div className="input-choose-excel-file">
          <input
            id="excel-file"
            type="file"
            name="file"
            onChange={this.handleImportFile}
          />
        </div>
        <div className="import-excel-btn">
          <div className="file-uploader-group">
            <span>Tên file: <strong>{this.state.fileholder}</strong></span>
            <label htmlFor="excel-file" onChange={this.handleImportFile}>Tải file excel lên (.xls)</label>

          </div>

          <span className="warning-file-type">{this.state.warningfiletype}</span>

          {
            this.state.errorrowcount > 0 ?
              <ExcelFile element={<button className="export-report-btn">Download Báo cáo</button>} filename={"Report_" + fileNameSplited}>
                <ExcelSheet dataSet={multidataset} name="Mô tả lỗi" />
              </ExcelFile> : null
          }
        </div>

        <p className="adding-file-result">Đã thêm <strong>{this.state.successrowcount}/{this.state.successrowcount + this.state.errorrowcount}</strong> tài khoản vào hệ thống</p>
        <div className="tool-bar-booking">
          <Grid container spacing={16}>


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

            <Grid item xs={12} md={2} style={{ marginTop: -17 }}>
              <TextField
                id="outlined-textarea"
                label="Tên file"
                placeholder="Tên file"
                multiline
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={sourceImportFileName}
                onChange={event => this.handleChangeFilter(event, 8)}
              />
            </Grid>

          </Grid>
        </div>

        <div className="imported-user-table">
          <Table aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell><span>Họ và tên</span><br /><span>(Tên tài khoản)</span></TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Tên danh sách file import</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data && data.length ? data.map((item, index) => {
                  {/* console.log(data); */}
                  return (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}>
                      <TableCell>{index + stt}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.phone}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.name}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user_tracking.birthday}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.gender === 1 ? 'Nam' : 'Nữ'}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.note}</TableCell>
                      <TableCell style={{ wordBreak: "break-all", width: '20%' }}>{item.user.address}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.degree}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>{item.user.importFileName ? item.user.importFileName.split('.')[0] : ''}</TableCell>
                      <TableCell style={{ wordBreak: "break-all" }}>
                        {
                          updateable ?
                            <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="EditIcon">
                              <img alt="" src="/images/icon/edit1.png" />
                            </IconButton> : null
                        }
                      </TableCell>


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
  }

  render() {
    const { classes } = this.props;
    const { data, page, size, total, progress, dataUser, listGender, stt, viewable, updateable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page special-page'}>
          {
            viewable ?
              <div className={classes.tableWrapper}>

                <div className="link-user-tracking-group">
                  <Link to="/admin/user-tracking">
                    <span className="title-page-user-tracking">
                      User tracking
                    </span>
                  </Link> <span>|</span>
                  <Link to="/admin/import-user"><span style={{ color: 'black' }} className="title-page-user-tracking">
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


              </div>
              : "Unauthorized error"}
        </Paper>
        {this.state.modalAdd && <ModalAddUpdate data={dataUser} gender={listGender} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalDetailtUser && <ModalDetailtUser data={dataUser} gender={listGender} callbackOff={this.closeModal.bind(this)} />}
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


export default withStyles(styles)(connect(mapStateToProps)(ImportUser));