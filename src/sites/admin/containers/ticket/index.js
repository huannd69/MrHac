import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { MuiPickersUtilsProvider, } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import TablePaginationActions from '../../components/pagination/pagination';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Link } from 'react-router-dom'
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalAddUpdate from './create-update-ticket';
import { matchPath } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import EnhancedTableToolbar from '../../components/table-toolbar';
import { listQuestion, getListResult } from '../../../../utils/apiAxios'

class ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      size: 20,
      number: '',
      name: ["Tất cả"],
      deviceType: 0,
      fromDate: '',
      toDate: '',
      style: 3,
      totalUser: 0,
      totalMobile: 0,
      totalWeb: 0,
      totalHis: 0,
      stringQuyery: '',
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
      type: -1,
      active: 1,
      dataHospital: [],
      status: {},
    }
  }
  handleChangePage = (event, action) => {
    this.setState({
      page: action,
      selected: []
    }, () => {
      this.loadPage()
    });
  };
  componentWillMount() {
    this.loadPage();
    // this.loadTotalUser();
  }
  updateTicket = (item) => {
    this.setState({
      modalAdd: true,
      item: item
    })
    //     if (item) {
    //       if (this.state.updateable) {
    //         this.setState({
    //           modalAdd: true,
    //           dataUser: item,
    //         })
    //       } else {
    //         toast.error("Unauthorized error!", {
    //           position: toast.POSITION.TOP_RIGHT
    //         });
    //       }
    //     } else {
    //       if (this.state.createable){
    //         this.setState({
    //           modalAdd: true,
    //           dataUser: {},
    //         })
    //       } else {
    //         toast.error("Unauthorized error!", {
    //           position: toast.POSITION.TOP_RIGHT
    //         });
    //       }
    // }
  }
  handleChangeFilter(event, index) {
    if (index == 1) {
      this.setState({
        page: 0,
        stringQuyery: event.target.value
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
        }, 500)
      })
    }
    if (index == 2) {
      this.setState({
        page: 0,
        status: event.target.value
      }, () => {
      })
    }
    if (index == 4) {
      this.setState({
        page: 0,
        hospitalId: event.target.value
      }, () => {
      })
    }
    if (index == 5) {
      this.setState({
        page: 0,
        fromDate: event
      }, () => {
      })
    }
    if (index == 6) {
      this.setState({
        page: 0,
        toDate: event
      }, () => {

      })
    }
    if (index == 7) {
      this.setState({
        page: 0,
        fromDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
      }, () => {
      })
    }
    if (index == 9) {
      this.setState({
        page: 0,
        toDate: moment(event._d).format('YYYY-MM-DD HH:mm:ss')
      }, () => {
      })
    }
  }
  renderChirenToolbar() {
    const { classes } = this.props;
    const { active, stringQuyery, createable } = this.state;
    return (
      <div>
        <TextField
          style={{ marginTop: 8, marginLeft: 0, width: '40%', float: 'left' }}
          id="outlined-textarea"
          label="Tìm kiếm"
          placeholder="Họ tên / Email / SĐT / Mã số thuế"
          // multiline
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.stringQuyery}
          onChange={(event) => this.handleChangeFilter(event, 1)}
        />
      </div>
    )
  }
  loadPage = () => {
    // setTimeout(() => {
    //     this.setState({
    //         data: [],
    //     })
    // }, 1000);
    let token = this.props.userApp.currentUser.token
    getListResult(token).then(res => {
      console.log(res)
    })
  }
  closeModal() {
    this.loadPage();
    this.setState({ modalAdd: false, modalDetailtAdmin: false, modalSetPassword: false });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ size: event.target.value }, () => {
    });
  };
  sorting(style) {
    if (style === this.state.style) {
      style = style < 10 ? style + 10 : style - 10;
    }
    this.setState({
      page: 0,
      style: style
    }, () => {
    })
  }
  onNumberChanger = (event) => {
    this.setState({ number: event.target.valuent })
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
    const url = matchPath('/admin/ticket-controller', { path: '/admin/ticket-controller' })
    console.log(url, 'urlurlurl');
    const { classes } = this.props;
    const { data, dataHospital, page, size, total, progress, stt } = this.state;
    return (
      <div>
        <div className={classes.tableWrapper}>
          <div className="link-user-tracking-group">
            <Link to="/admin/ticket">
              <span style={{ color: 'black', borderBottom: '1px' }} className="title-page-user-tracking">
                Thiết lập giờ
                </span>
            </Link><span>|</span>
            <Link to="/admin/ticket-controller"><span className="title-page-user-tracking">
              Quản lý tài khoản lấy số
                </span></Link>
          </div>
          <EnhancedTableToolbar
            title=""
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
                  <TableCell>Tên cơ sở y tế
                        </TableCell>
                  <TableCell>Thời gian hết hạn
                        </TableCell>
                  <TableCell>Thứ trong tuần
                        </TableCell>
                  <TableCell>Áp dụng đến
                        </TableCell>
                  <TableCell>Tổng lượt lấy số</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  dataHospital && dataHospital.length ? dataHospital.map((item, index) => {
                    return (
                      <TableRow
                        hover
                        key={index}
                        tabIndex={-1}>
                        <TableCell>{index + stt}</TableCell>
                        <TableCell style={{ wordBreak: "break-all" }}>{item.hospital.name}</TableCell>
                        <TableCell style={{ wordBreak: "break-all" }}>
                          {item.hospital.timeCombin ? item.hospital.timeCombin : ''}
                        </TableCell>
                        <TableCell style={{ wordBreak: "break-all" }}>
                          {item.hospital.dailyCombin ? item.hospital.dailyCombin : ''}
                        </TableCell>
                        <TableCell style={{ wordBreak: "break-all" }}><MuiPickersUtilsProvider utils={MomentUtils}>
                          {item.hospital.expired ? moment(item.hospital.expired).format('DD-MM-YYYY') : ''}
                        </MuiPickersUtilsProvider></TableCell>
                        <TableCell style={{ wordBreak: "break-all" }}><MuiPickersUtilsProvider utils={MomentUtils}>
                          {item.hospital.numTurn ? item.hospital.numTurn : ''}
                        </MuiPickersUtilsProvider></TableCell>

                        <TableCell>
                          <Button className="button-new" variant="contained" color="secondary" onClick={() => this.updateTicket(item)} style={{ marginLeft: 20, marginTop: 17 }}>Thiết lập</Button>
                        </TableCell>

                      </TableRow>
                    );
                  })
                    :
                    <TableRow>
                      <TableCell>{dataHospital ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
                {this.state.modalAdd && <ModalAddUpdate data={this.state.item} callbackOff={this.closeModal.bind(this)} />}
              </TableFooter>
            </Table>

          </div>
        </div>
      </div>

    );
  }
}


const listDay = [
  {
    name: 'Tất cả',
    value: 0
  },
  {
    name: 'Thứ hai',
    value: 1
  },
  {
    name: 'Thứ ba',
    value: 2
  },
  {
    name: 'Thứ tư',
    value: 3
  },
  {
    name: 'Thứ năm',
    value: 4
  },
  {
    name: 'Thứ sáu',
    value: 5
  },
  {
    name: 'Thứ bảy',
    value: 6
  },
  {
    name: 'Chủ nhật',
    value: 7
  },
];

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

export default withStyles(styles)(connect(mapStateToProps)(ticket));