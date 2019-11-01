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
import IconRefresh from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ContactIcon from '@material-ui/icons/PermContactCalendar';
import TablePaginationActions from '../../components/pagination/pagination';
import { withStyles } from '@material-ui/core/styles';
import userProvider from '../../../../data-access/user-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import moment from 'moment';
import ModalAddUpdate from './create-update-doctor';
import ModalDetailtUser from './detail-doctor';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import roleProvider from '../../../../data-access/role-provider';


class User extends Component {
  constructor(props) {
    super(props);
    let viewable = this.props.userApp.currentUser && this.props.userApp.currentUser.permission && (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 128).length > 0;
    let createable = this.props.userApp.currentUser && this.props.userApp.currentUser.permission && (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 256).length > 0;
    let updateable = this.props.userApp.currentUser && this.props.userApp.currentUser.permission && (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 512).length > 0;


    this.state = {
      viewable,
      createable,
      updateable,
      page: 0,
      size: 20,
      queryString: '',
      active: 1,
      type: 1,
      style: -1,
      data: [],
      total: 0,
      selected: [],
      dataUser: {},
      listGender: [{
        gender: {
          id: -1,
          name: '--- Chọn giới tính (*) ---'
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
      listTitle: [{
        title: {
          id: -1,
          name: '--- Chọn chức vụ ---'
        }
      }, {
        title: {
          id: 1,
          name: 'Giám đốc'
        }
      }, {
        title: {
          id: 2,
          name: 'Phó giám đốc'
        },
      }, {
        title: {
          id: 3,
          name: 'Trưởng khoa'
        }
      }, {
        title: {
          id: 4,
          name: 'Phó trưởng khoa'
        }
      }],
      listDegree: [{
        degree: {
          id: -1,
          name: '--- Chọn học hàm học vị (*) ---'
        }
      }, {
        degree: {
          id: 1,
          name: 'Giáo sư'
        }
      }, {
        degree: {
          id: 2,
          name: 'Phó Giáo sư'
        },
      }, {
        degree: {
          id: 3,
          name: 'Tiến sĩ'
        }
      }, {
        degree: {
          id: 4,
          name: 'Thạc sĩ'
        }
      }, {
        degree: {
          id: 5,
          name: 'Bác sĩ chuyên khoa II'
        }
      }, {
        degree: {
          id: 6,
          name: 'Bác sĩ chuyên khoa I'
        }
      }, {
        degree: {
          id: 7,
          name: 'Bác sĩ đa khoa'
        }
      }],
      listSpecialist: [],
      progress: false,
      modalAdd: false,
      modalResult: false,
      modalDetailtUser: false,
      roleId: '',
      permissionId: []
    }
  }

  componentWillMount() {
    const urlParams = new URLSearchParams(this.props.location.search);
    const idUser = urlParams.get('id');
    this.setState({ idUser })
    this.props.history.replace(this.props.location.pathname);
  };


  componentDidMount() {
    this.loadPage();
    this.getSpecialist();
    if (this.state.idUser) {
      this.getDetail(this.state.idUser);
    }
    if (this.InputLabelRef)
      this.setState({
        labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      });
  }

  getDetail(id) {
    (id).then(s => {
      if (s && s.code == 0 && s.data) {
        this.setState({
          dataUser: s.data,
        })
        this.modalDetailAdmin(s.data);
      }
    }).catch(e => {
    })
  }

  loadPage() {
    this.setState({ progress: true })
    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      queryString: this.state.queryString.trim(),
      active: this.state.active,
      type: this.state.type,
      roleId: this.state.roleId,
      style: this.state.style,
    }
    userProvider.search(params).then(s => {
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

  getSpecialist() {
    let params = {
      page: 1,
      size: 9999,
    }
    specialistProvider.search(params).then(s => {
      if (s && s.code == 0 && s.data) {
        let dataTemp = [{
          specialist: {
            id: -1,
            name: '--- Chọn chuyên khoa ---'
          }
        }]
        for (var i = 0; i < s.data.data.length; i++) {
          dataTemp.push(s.data.data[i])
        }
        this.setState({
          listSpecialist: dataTemp,
        })
      }
    }).catch(e => {
    })
  }

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

  modalDetailAdmin(item) {
    if (this.state.viewable) {
      this.setState({ modalDetailtUser: true, dataUser: item })
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
    switch (this.state.style) {
      case 1:
        this.setState({
          page: 0,
          style: 4
        }, () => {
          this.loadPage();
        })
        break;
      case 4:
        this.setState({
          page: 0,
          style: 1
        }, () => {
          this.loadPage();
        })
        break;
      default:
        this.setState({
          page: 0,
          style: 1
        }, () => {
          this.loadPage();
        })
    }
  }

  sortDate() {
    switch (this.state.style) {
      case 2:
        this.setState({
          page: 0,
          style: 3
        }, () => {
          this.loadPage();
        })
        break;
      case 3:
        this.setState({
          page: 0,
          style: 2
        }, () => {
          this.loadPage();
        })
        break;
      default:
        this.setState({
          page: 0,
          style: 3
        }, () => {
          this.loadPage();
        })
    }
  }

  handleChangeFilter(event, action) {
    if (action == 1) {
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
          this.loadPage()
        }, 500)
      })
    }
    if (action == 2) {
      this.setState({
        page: 0,
        active: event.target.value
      }, () => {
        this.loadPage();
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
        //   multiline
          placeholder="Tên, Khoa, Email, SĐT, Số văn bằng chuyên môn"
          className={classes.textField}
          value={this.state.queryString}
          onChange={(event) => this.handleChangeFilter(event, 1)}
          margin="normal" variant="outlined"
        />
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel style={{ top: 8, background: '#FFF' }}
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-simple"
          >
            Trạng thái
          </InputLabel>
          <Select
            value={active}
            onChange={(event) => this.handleChangeFilter(event, 2)}
            input={
              <OutlinedInput
                // labelWidth={this.state.labelWidth}
                name="age"
                id="outlined-age-simple"
              />
            }
            style={{ width: 150, marginTop: 8, height: 55, textAlign: "left" }}>
            <MenuItem value='-1'>Tất cả</MenuItem>
            <MenuItem value='1'>Active</MenuItem>
            <MenuItem value='0'>Inactive</MenuItem>
          </Select>
        </FormControl>
        {
          createable ? <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button> : null
        }
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    const { dataUser, data, page, size, total, progress, stt, listGender, listTitle, listDegree, listSpecialist, viewable, createable, updateable } = this.state;
    return (
      <div>
        <Paper className={classes.root + ' admin-page doctor-page'}>
          {
            viewable ?
              <div className={classes.tableWrapper}>
                <h2 className="title-page">Tài khoản bác sĩ</h2>
                <EnhancedTableToolbar
                  numSelected={0}
                  actionsChiren={
                    this.renderChirenToolbar()
                  }
                />
                {progress ? <LinearProgress /> : null}
                <div className="table-wrapper">
                <Table aria-labelledby="tableTitle" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên bác sĩ
                        <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                          <SortByAlphaIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>Chức vụ</TableCell>
                      <TableCell>Chuyên khoa</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Số văn bằng chuyên môn</TableCell>
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
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{index + stt}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.user.name}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.user.title == 1 ? "Giám đốc" : item.user.title == 2 ? "Phó Giám đốc" : item.user.title == 3 ? "Trưởng Khoa" : item.user.title == 4 ? "Phó Trưởng khoa" : ""}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.specialist ? item.specialist.name : ''}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)} style={{ wordBreak: "break-all" }}>{item.user.email}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.user.phone}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.user.active ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.user.certificateCode}</TableCell>
                            <TableCell onClick={() => this.modalDetailAdmin(item)}>{moment(item.user.createdDate).format("DD-MM-YYYY")}</TableCell>
                            <TableCell>
                              {
                                updateable ?
                                <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="EditIcon">
                                  <img alt="" src="/images/icon/edit1.png"/>
                                </IconButton>: null
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })
                        :
                        <TableRow>
                          <TableCell>{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
        {this.state.modalAdd && <ModalAddUpdate data={dataUser} gender={listGender} title={listTitle} degree={listDegree} specialist={listSpecialist} callbackOff={this.closeModal.bind(this)} />}
        {this.state.modalDetailtUser && <ModalDetailtUser data={dataUser} gender={listGender} title={listTitle} degree={listDegree} specialist={listSpecialist} callbackOff={this.closeModal.bind(this)} />}
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