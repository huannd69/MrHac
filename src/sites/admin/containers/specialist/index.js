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
import EditIcon from '@material-ui/icons/Edit';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm/';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import ModalAddUpdate from './create-update-specialist';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import roleProvider from '../../../../data-access/role-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import userProvider from '../../../../data-access/user-provider';


class User extends Component {
  constructor(props) {
    super(props);
    let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 524288).length > 0;
    let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 1048576).length > 0;
    let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 2097152).length > 0;
    let deleteable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 67108864).length > 0;

    this.state = {
      page: 0,
      size: 20,
      name: '',
      type: 4,
      data: [],
      total: 0,
      selected: [],
      dataSpecialist: {},
      progress: false,
      modalAdd: false,
      modalDetailtSpecialist: false,
      confirmDialog: false,
      tempDelete: [],
      viewable,
      createable,
      updateable,
      deleteable
    }
  }

componentWillMount() {
    this.loadPage();
}


loadPage() {
    this.setState({ progress: true })
    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      name: this.state.name.trim(),
      type: this.state.type
    }
    specialistProvider.search(params).then(s => {
      if (s && s.code == 0 && s.data) {
        let stt = 1 + (params.page - 1) * params.size;
        this.setState({
          data: s.data.data,
          stt,
          total: s.data.total
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

  modalCreateUpdate(item) {
    if (item) {
      if (this.state.updateable) {
        this.setState({
          modalAdd: true,
          dataSpecialist: item,
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } else {
      if (this.state.createable){
        this.setState({
          modalAdd: true,
          dataSpecialist: {},
        })
      } else {
        toast.error("Unauthorized error!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  }

  closeModal() {
    this.loadPage();
    this.setState({ modalAdd: false });
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
    if (action == 1) {
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
  }

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

  sortDate() {
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

  showModalDelete(item) {
    if (this.state.deleteable){
     this.setState({ confirmDialog: true, tempDelete: item })
    } else {
      toast.error("Unauthorized error!", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  delete(type) {
    this.setState({ confirmDialog: false })
    if (type == 1) {
      specialistProvider.delete(this.state.tempDelete.specialist.id).then(s => {
        if (s && s.data && s.code == 0) {
          toast.success("Xóa " + this.state.tempDelete.specialist.name + " thành công!", {
            position: toast.POSITION.TOP_RIGHT
          });
          this.setState({ page: 0 });
          this.loadPage();
          this.setState({ tempDelete: {} });
        }
        else if (s.code == 3){
          toast.error("Không xóa được " + this.state.tempDelete.specialist.name + " vì đã có liên kết với dịch vụ", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else if (s.code == 4){
          toast.error("Không xóa được " + this.state.tempDelete.specialist.name + "  vì đã có liên kết với bác sĩ", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else {
          toast.error("Xóa Chuyên khoa không thành công!", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
    }
  }

  renderChirenToolbar() {
    const { classes } = this.props;
    const { active, createable } = this.state;
    return (
      <div>
        <TextField
          style={{
            marginTop: 8,
            marginLeft: 0,
            width: '40%',
            float: 'left'
          }}
          id="outlined-textarea" label="Tìm kiếm" 
          // multiline
          placeholder="Tên chuyên khoa"
          className={classes.textField}
          value={this.state.name}
          onChange={(event) => this.handleChangeFilter(event, 1)}
          margin="normal" variant="outlined"
        />
        {
          createable ?
          <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>: null
        }
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { data, page, size, total, progress, stt, dataSpecialist, name, createable, viewable, updateable, tempDelete, deleteable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page special-page'}>
        {
            viewable ?
          <div className={classes.tableWrapper}>
            <h2 className="title-page">Quản lý Chuyên khoa</h2>
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
                  <TableCell style={{ width: "50%"}}>Tên chuyên khoa
                    <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                      <SortByAlphaIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Ngày tạo
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
                    return (
                      <TableRow
                        hover
                        key={index}
                        tabIndex={-1}>
                        <TableCell>{index + stt}</TableCell>
                        <TableCell style={{ wordBreak: "break-all"}}>{item.specialist.name}</TableCell>
                        <TableCell><img src={item.specialist.linkImages}  alt="" className="image-icon"/></TableCell>
                        <TableCell>{moment(item.specialist.createdDate).format("DD-MM-YYYY")}</TableCell>
                        <TableCell>
                          {
                            updateable ?
                            <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="EditIcon">
                               <img alt="" src="/images/icon/edit1.png"/>
                            </IconButton> : null
                          }
                          {
                            deleteable ? 
                            <IconButton onClick={() => this.showModalDelete(item)} color="primary" className={classes.button} aria-label="IconRefresh">
                              <img alt="" src="/images/icon/delete.png"/>
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
        : "Unauthorized error"}
        </Paper>
        {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn có chắc chắn muốn xóa Chuyên khoa " + tempDelete.specialist.name + " ra khỏi danh sách?"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
        {this.state.modalAdd && <ModalAddUpdate data={dataSpecialist} callbackOff={this.closeModal.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(User));