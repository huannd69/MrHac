import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
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
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm/';
import { withStyles } from '@material-ui/core/styles';
import ModalAddUpdate from './create-update-role';
import SortIcon from '@material-ui/icons/Sort';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import { listQuestion, deleteListquestion } from '../../../../utils/apiAxios'
import DetailRole from './detail-role'
import AddQuestions from './add-questions'
class MgrRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      size: 20,
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
      data: [],
      modalDetailRole: false,
      modalDetailUserRole: false,
      addQuestions: false,
      dataListQues: []
    }
  }
  componentWillMount() {
    this.loadPage();
  }

  loadPage() {
    let token = this.props.userApp.currentUser.token
    listQuestion(token).then(res => {
      console.log(res, 'data');
      let stt = res.data.length;
      this.setState({
        dataQuestion: res.data,
        stt
      })
    }).catch(err => {
      console.log(err);
    })
    // this.setState({ progress: true })
    // let params = {
    //   page: this.state.page + 1,
    //   size: this.state.size,
    //   stringQuery: this.state.stringQuery.trim(),
    //   value: this.state.value,
    //   blocked: this.state.blocked,
    //   type: this.state.type
    // }

    // RoleProvider.search(params).then(s => {
    //   if (s && s.code == 0 && s.data) {
    //     let stt = 1 + (params.page - 1) * params.size;
    //     this.setState({
    //       data: s.data.data,
    //       stt,
    //       total: s.data.total
    //     })
    //   }
    //   this.setState({ progress: false })
    // }).catch(e => {
    //   this.setState({ progress: false })
    // })
  }



  closeModal() {
    this.loadPage();
    this.setState({ modalAdd: false, modalDetailRole: false, modalDetailUserRole: false, addQuestions: false,dataListQues:[] });
  }

  modalCreateUpdate(item) {
    if (item) {
      this.setState({
        modalAdd: true,
        dataEdit: item,
      })

    }
    else {
      this.setState({
        modalAdd: true,
        dataEdit: {}
      })

    }
  }

  showModalDelete(item) {
    this.setState({ confirmDialog: true, tempDelete: item })
  }

  delete(type) {
    this.setState({ confirmDialog: false })
    let id = this.state.tempDelete._id
    let token = this.props.userApp.currentUser.token
    deleteListquestion(id, token).then(res => {
      console.log('res: ', res);
      this.loadPage();
      this.setState({ tempDelete: {} });
    })
    // if (type == 1) {
    //   RoleProvider.delete(this.state.tempDelete.roles.id).then(s => {
    //     if (s && s.data) {
    //       toast.success("Xóa role thành công!", {
    //         position: toast.POSITION.TOP_CENTER
    //       });
    //       this.setState({ page: 0 });
    //       this.loadPage();
    //       this.setState({ tempDelete: {} });
    //     }
    //     else if (s.code == 2) {
    //       toast.error("Không xóa được role vì đã có user/staff!", {
    //         position: toast.POSITION.TOP_CENTER
    //       });
    //     }
    //     else {
    //       toast.error("Xóa role không thành công!", {
    //         position: toast.POSITION.TOP_CENTER
    //       });
    //     }
    //   })
    // }
  }

  handleCheckUserAdmin() {
    if (this.state.viewableUserAdmin) {

    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }
  renderChirenToolbar() {
    const { classes } = this.props;
    const { active, stringQuyery, createable } = this.state;
    return (
      <div>
        {/* <TextField
                style={{ marginTop: 8, marginLeft: 0, width: '40%', float: 'left' }}
                id="outlined-textarea"
                label="Tìm kiếm"
                placeholder="Họ tên / Email / SĐT / Mã số thuế"
                // multiline
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={stringQuyery}
                onChange={(event) => this.handleChangeFilter(event, 1)}
            /> */}
        {/* <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel style={{ background: '#FFF', marginTop: '-7px' }}
                    ref={ref => {
                        this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-age-simple"
                >
                    Trạng thái
                </InputLabel>
                <Select
                    style={{ width: 150, height: 55, textAlign: "left" }}
                    value={active}
                    onChange={(event) => this.handleChangeFilter(event, 2)}
                    input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="age"
                            id="outlined-age-simple"
                        />
                    }
                >
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                </Select>
            </FormControl> */}
        {

          <Button className="button-new" variant="contained" color="secondary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>

        }
      </div>
    )
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
    this.setState({ modalDetailUserRole: true, dataRole: item.questions, })
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

  renderObjectType = (item) => {
    switch (Number(item.objectType)) {
      case 1:
        return (
          <TableCell onClick={() => this.modalDetailAdmin(item)}>Bệnh nhân xanh</TableCell>
        )
      case 2:
        return (
          <TableCell onClick={() => this.modalDetailAdmin(item)}>Bệnh nhân vàng</TableCell>
        )
      case 3: return (
        <TableCell onClick={() => this.modalDetailAdmin(item)}>Bệnh nhân đỏ</TableCell>
      )
      default:
        return (
          <TableCell onClick={() => this.modalDetailAdmin(item)}></TableCell>
        )
    }
  }
  renderType = (item) => {
    switch (Number(item.type)) {
      case 1:
        return (<TableCell onClick={() => this.modalDetailAdmin(item)}>Hiển thị lần đầu</TableCell>)
      case 2:
        return (<TableCell onClick={() => this.modalDetailAdmin(item)}>Hiển thị hằng ngày</TableCell>)
        default:
          return  (<TableCell onClick={() => this.modalDetailAdmin(item)}></TableCell>)
    }

  }
  showModalAdd = (item) => {
    this.setState({ addQuestions: true, dataRole: item, })

  }
  render() {
    const { classes } = this.props;
    const { data, page, size, total, progress, dataListQues, dataRole, dataQuestion, confirmDialog, viewable, viewableUserAdmin, deleteable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page role-page'}>
          {
            <div className={classes.tableWrapper}>
              <h2 className="title-page">Quản lý danh sách câu hỏi</h2>
              <EnhancedTableToolbar
                title=""
                actionsChiren={
                  this.renderChirenToolbar()
                }
                numSelected={0}
              />
              {progress ? <LinearProgress /> : null}
              <div className="table-wrapper">
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên list câu hỏi
                      <IconButton onClick={() => this.sortCodeRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                          <SortByAlphaIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Bệnh
                      <IconButton onClick={() => this.sortRole()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                          <SortByAlphaIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Phân loại</TableCell>
                      <TableCell>Đối tượng
                      <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                          <SortIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Tiện ích</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      dataQuestion && dataQuestion.length ? dataQuestion.map((item, index) => {
                        return (
                          <TableRow
                            hover
                            key={index}
                            tabIndex={-1}>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{index + 1}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.name}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.sicks.name}</TableCell>
                            <TableCell>
                              {this.renderType(item)}

                            </TableCell>
                            {this.renderObjectType(item)}
                            <TableCell>
                              {
                                <IconButton onClick={() => this.modalCreateUpdate(item, 1)} color="primary" className={classes.button} aria-label="EditIcon">
                                  <img alt="" src="/images/icon/edit1.png" />
                                </IconButton>
                              }
                              {
                                <IconButton onClick={() => this.showModalDelete(item)} color="primary" className={classes.button} aria-label="IconRefresh">
                                  <img alt="" src="/images/icon/delete.png" />
                                </IconButton>
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

              {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa role này ra khỏi danh sách?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
            </div>
          }
        </Paper>
        {this.state.modalAdd && <ModalAddUpdate history={this.props.history} data={this.state.dataEdit} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalDetailRole && <DetailRole data={dataRole} callbackOff={this.closeModal.bind(this)} />}
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
export default withStyles(styles)(connect(mapStateToProps)(MgrRole));