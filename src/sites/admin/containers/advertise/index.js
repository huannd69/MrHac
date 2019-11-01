import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
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
import IconRefresh from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import ContactIcon from '@material-ui/icons/PermContactCalendar';
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm/';
import { withStyles } from '@material-ui/core/styles';
import RoleProvider from '../../../../data-access/role-provider';
import PermissionProvider from '../../../../data-access/permission-provider';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import SortIcon from '@material-ui/icons/Sort';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import userProvider from '../../../../data-access/user-provider';
import advertiseProvider from '../../../../data-access/advertise-provider';
import ModalDetailtAdvertise from './details-advertise'
import ModalAddUpdate from './create-update-advertise'
class Advertise extends React.Component {
  constructor(props) {
    super(props);
    let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 1024).length > 0;
    let createable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 2048).length > 0;
    let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 4096).length > 0;
    let deleteable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 8192).length > 0;
    let viewableUserAdmin = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 1).length > 0;

    this.state = {
      page: 0,
      size: 10,
      name: '',
      stringQuery: '',
      type: '',
      blocked: '',
      value: -1,
      total: 0,
      dataRole: {},
      roles: [],
      selected: [],
      tempDelete: {},
      progress: false,
      modalAdd: false,
      confirmDialog: false,
      listPermission: [],
      data: [],
      modalDetailRole: false,
      modalDetailUserRole: false,
      permissionId: [],
      viewable,
      createable,
      updateable,
      viewableUserAdmin,
      deleteable,
    }
  }
  componentWillMount() {
    // this.getPermission();
    this.loadPage();
  }

  loadPage() {
    this.setState({ progress: true })
    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      title: this.state.stringQuery.trim(),
      content: this.state.value,
      type: this.state.type
    }

    advertiseProvider.search(params).then(s => {
      console.log(s, 'áđas');
      if (s && s.code == 0) {
        let stt = 1 + (params.page - 1) * params.size;
        this.setState({
          data: s.data.data,
          stt,
          // total: s.data.total
        })
      }
      this.setState({ progress: false })
    }).catch(e => {
      this.setState({ progress: false })
    })
  }

  checkPermission(data) {
    this.state.data = this.state.data.map(item => {
      if (this.state.data.permission) {
        item.checkId = this.state.data.permission.filter(x => x.id == data.permission.id).length > 0;
      }
      return item;
    });
    this.setState({
      data
    });
  }

  getPermission() {
    this.setState({ progress: true })
    let params = {
      page: 1,
      size: 99999,
      name: this.state.name
    }
    PermissionProvider.search(params).then(s => {
      if (s && s.code == 0 && s.data) {
        let stt = 1 + (params.page - 1) * params.size;
        let dataTemp = [{
          permission: {
            value: -1,
            name: 'Tất cả'
          }
        }]
        for (var i = 0; i < s.data.length; i++) {
          dataTemp.push(s.data[i])
        }
        this.setState({
          listPermission: dataTemp,
          dataPermission: s.data,
          stt
        })
      }
      this.setState({ progress: false })
    }).catch(e => {
      this.setState({ progress: false })
    })
  }

  closeModal() {
    this.loadPage();
    this.setState({ modalAdd: false, modalDetailRole: false, modalDetailUserRole: false });
  }

  modalCreateUpdate(item) {
    if (item) {
      if (this.state.updateable) {
        this.setState({
          modalAdd: true,
          dataRole: item,
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
          dataRole: {},
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  }

  showModalDelete(item) {
    if (this.state.deleteable) {
      this.setState({ confirmDialog: true, tempDelete: item.advertise })
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  delete(type) {
    this.setState({ confirmDialog: false })
    if (type == 1) {
      advertiseProvider.delete(this.state.tempDelete.id).then(s => {
        if (s && s.data) {
          toast.success("Xóa quảng cáo thành công!", {
            position: toast.POSITION.TOP_CENTER
          });
          this.setState({ page: 0 });
          this.loadPage();
          this.setState({ tempDelete: {} });
        }
        else {
          toast.error("Xóa quảng cáo không thành công!", {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
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

  sortDate() {
    switch (this.state.type) {
      case 2:
        this.setState({
          page: 0,
          type: 3
        }, () => {
          this.loadPage();
        })
        break;
      case 3:
        this.setState({
          page: 0,
          type: 2
        }, () => {
          this.loadPage();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 3
        }, () => {
          this.loadPage();
        })
    }
  }

  sortRole() {
    switch (this.state.type) {
      case 1:
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
          type: 1
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

  sortCodeRole() {
    switch (this.state.type) {
      case 7:
        this.setState({
          page: 0,
          type: 6
        }, () => {
          this.loadPage();
        })
        break;
      case 6:
        this.setState({
          page: 0,
          type: 7
        }, () => {
          this.loadPage();
        })
        break;
      default:
        this.setState({
          page: 0,
          type: 6
        }, () => {
          this.loadPage();
        })
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

  handleChangeRowsPerPage = event => {
    this.setState({ size: event.target.value }, () => {
      this.loadPage()
    });
  };

  modalDetailAdmin(item) {
    this.setState({ modalDetailRole: true, dataRole: item, })
  }

  modalDetailUserAdmin(item) {
    this.setState({ modalDetailUserRole: true, dataRole: item, })
  }

  handleChangeFilter(event, action) {
    if (action == 1) {
      this.setState({
        page: 0,
        stringQuery: event.target.value
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
    if (action == 2) {
      this.setState({ page: 0, value: event.target.value }, () => { this.loadPage() })
    }
  }

  renderChirenToolbar() {
    const { classes } = this.props;
    const { value, listPermission, data, createable } = this.state;
    return (
      <div>
        <TextField
          style={{
            marginTop: 8,
            marginLeft: 0,
            width: '40%',
            float: 'left'
          }}
          id="outlined-textarea"
          label="Tìm kiếm"
          placeholder="Tìm kiếm quảng cáo"
          className={classes.textField}
          // multiline
          value={this.state.stringQuery}
          onChange={(event) => this.handleChangeFilter(event, 1)}
          margin="normal"
          variant="outlined"
        />
        <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>
        {/* {
          createable ? 
          <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>
          : null
        } */}
      </div>
    )
  }
  renderType = (type) => {
    switch (type) {
      case 1: return <TableCell>{'NOTIFICATION'}</TableCell>
      case 2: return <TableCell>{'PROMOTION'}</TableCell>
      case 4: return <TableCell>{'NEW_FEATURES'}</TableCell>
      default: return <TableCell>{''}</TableCell>
    }
  }
  render() {
    const { classes } = this.props;
    const { data, page, size, total, progress, stt, dataRole, dataPermission, roles, confirmDialog, viewable, viewableUserAdmin, updateable, deleteable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page role-page'}>
          {
            viewable ?
              <div className={classes.tableWrapper}>
                <h2 className="title-page">Quản lý quảng cáo</h2>
                <EnhancedTableToolbar
                  title=""
                  numSelected={0}
                  actionsChiren={
                    this.renderChirenToolbar()
                  }
                />
                {progress ? <LinearProgress /> : null}
                <div className="table-wrapper">
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Type
                      <IconButton onClick={() => this.sortCodeRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Title
                      <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Description
                      <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Content
                      <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Value
                  <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton></TableCell>
                        <TableCell>Image
                  <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                            <SortByAlphaIcon />
                          </IconButton></TableCell>
                        <TableCell>Create Date
                      <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>Update Date
                      <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                            <SortIcon />
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        data && data.length ? data.map((item, index) => {
                          return (
                            <TableRow
                              hover
                              key={index}
                              tabIndex={-1}>
                              <TableCell>{index + stt}</TableCell>
                              {this.renderType(item.advertise.type)}
                              <TableCell>{item.advertise.title}</TableCell>
                              <TableCell>{item.advertise.description}</TableCell>
                              <TableCell>{item.advertise.content}</TableCell>
                              <TableCell>{item.advertise.value}</TableCell>
                              <TableCell>
                                {
                                  item.advertise.images ? <img style={{ height: 100, margin: 'auto', border: "1px soild" }}
                                    src={item.advertise.images.absoluteUrl()} /> : null
                                }
                              </TableCell>
                              <TableCell>{moment(item.advertise.createdDate).format("DD-MM-YYYY")}</TableCell>
                              <TableCell>{moment(item.advertise.updatedDate).format("DD-MM-YYYY")}</TableCell>
                              <TableCell>
                                {/* {
                                  updateable ?
                                    <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="EditIcon">
                                      <img alt="" src="/images/icon/edit1.png" />
                                    </IconButton> : null
                                } */}
                                {
                                  deleteable ?
                                    <IconButton onClick={() => this.showModalDelete(item)} color="primary" className={classes.button} aria-label="IconRefresh">
                                      <img alt="" src="/images/icon/delete.png" />
                                    </IconButton> : null
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })
                          :
                          <TableRow>
                            <TableCell>{this.state.stringQuery ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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

                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa quảng cáo này ra khỏi danh sách?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
              </div>
              : "Unauthorized error"}
        </Paper>
        {this.state.modalDetailRole && <ModalDetailtAdvertise data={dataRole} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalAdd && <ModalAddUpdate history={this.props.history} data={dataRole} callbackOff={this.closeModal.bind(this)} />}
        {/* {this.state.modalDetailUserRole && <ModalDetailtUserRole data={dataRole} callbackOff={this.closeModal.bind(this)} />} */}
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
  tableWrapper: {
    overflowX: 'auto',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});
export default withStyles(styles)(connect(mapStateToProps)(Advertise));