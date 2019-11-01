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
import Delete from '@material-ui/icons/Delete';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import stringUtils from 'mainam-react-native-string-utils';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ContactIcon from '@material-ui/icons/PermContactCalendar';
import TablePaginationActions from '../../components/pagination/pagination';
import { withStyles } from '@material-ui/core/styles';
import userProvider from '../../../../data-access/user-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import serviceProvider from '../../../../data-access/service-provider';
import moment from 'moment';
import ModalAddUpdate from './create-update-service';
import ModalDetailtUser from './detail-service';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      size: 9999,
      queryString: '',
      active: 1,
      type: 8,
      value: -1,
      style: -1,
      data: [],
      total: 0,
      services: [],
      selected: [],
      serviceType: [],
      dataUser: {},
      code: '',
      listSpecialist: [],
      progress: false,
      modalAdd: false,
      modalResult: false,
      modalDetailtUser: false,
      hospitalId: '',
      serviceId: null,
      isOpen: false,
      name: '',
      serviceTypeId: -1
    }
    this.closePopup = this.closePopup.bind(this)


  }

  componentWillMount() {
    this.getRoles()

    const urlParams = new URLSearchParams(this.props.location.search);
    const idUser = urlParams.get('id');
    this.setState({ idUser })
    this.props.history.replace(this.props.location.pathname);

  }


  componentDidMount() {

  }
  // toggleModal = () => {
  //   this.setState({
  //     isOpen: !this.state.isOpen
  //   });
  // }

  getRoles() {

    // let id = (this.props.userApp.currentUser || {}).id;
    // userProvider.getDetail(id).then(s => {

    //   if (s && s.code == 0 && s.data) {
    //     this.setState({
    //       hospitalId: s.data.hospitalByAdmin.id,
    //     }, () => {
    //       this.loadPage();
    //     })

    //   }
    //   this.setState({ progress: false })
    // }).catch(e => {
    //   this.setState({ progress: false })
    // })
  }

  loadPage() {
    this.setState({ progress: true })
    let params = {
      page: this.state.page + 1,
      size: this.state.size,
      queryString: this.state.queryString.trim(),
      active: this.state.active,
      type: this.state.type,
      style: this.state.style,
      serviceTypeId: this.state.serviceTypeId,
    }
    let hospitalId = this.state.hospitalId
    serviceProvider.search(hospitalId, params).then(s => {

      if (s && s.code == 0 && s.data) {
        let stt = 1 + (params.page - 1) * params.size;
        let dataTemp = [{
          serviceType: {
            id: -1,
            serviceTypeId: 'Tất cả'
          }
        }]
        for (var i = 0; i < s.data.length; i++) {
          dataTemp.push(s.data[i])
        }
        this.setState({
          serviceType: dataTemp,
          services: s.data.data,
          stt
        })
      }
      this.setState({ progress: false })
    }).catch(e => {
      this.setState({ progress: false })
    })
  }

  closePopup() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  deleteService() {
    if (!this.state.currentService || !this.state.currentService.service)
      return;
    let id = this.state.currentService.service.id;
    let nameService = this.state.currentService.service.name;
    serviceProvider.deleteService(id)
      .then((res) => {
        // if (res.code == 0) {
        //   toast.success(`Xóa dịch vụ ${nameService} thành công`, {
        //     position: toast.POSITION.TOP_RIGHT
        //   });
        //   this.setState({
        //     isOpen: !this.state.isOpen
        //   });
        //   this.loadPage();

        // } else {
        //   toast.error("xóa dịch vụ không thành công!", {
        //     position: toast.POSITION.TOP_RIGHT
        //   });
        // }
          switch (res.code) {
            case 0:
            toast.success(`Xóa dịch vụ ${nameService} thành công`, {
                  position: toast.POSITION.TOP_RIGHT
                });
                this.setState({
                  isOpen: !this.state.isOpen
                });
                this.loadPage();
                break;
            case 2:
                toast.error(`Dịch vụ đang gán với lịch làm việc của bác sĩ có khách hàng đặt lịch. Vui lòng điều chỉnh các đặt lịch trước khi xoá.`, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;
            case 3:
                toast.error(`Đã tồn tại lịch trình đã được gán với dịch vụ này`, {
                    position: toast.POSITION.TOP_RIGHT
                });
                break;

          
            default:
                toast.error("xóa dịch vụ không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            
        }

        this.loadPage();

      })


  }
  modalCreateUpdate(item) {
    if (item) {
      this.setState({
        modalAdd: true,
        service: item,
      })
    } else {
      this.setState({
        modalAdd: true,
        service: {},
      })
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
    switch (this.state.type) {
      case 1:
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
          type: 1
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

  sortTypeService() {
    switch (this.state.type) {
      case 4:
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
          type: 4
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

  PriorityNumber() {
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
          type: 8
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
        serviceTypeId: event.target.value
      }, () => {
        this.loadPage();
      })
    }
  }


  renderChirenToolbar() {
    const { classes } = this.props;
    const { active, services, value, serviceTypes, serviceTypeId, serviceType, name } = this.state;
    return (
      <div>

        <TextField
          style={{
            marginTop: 8,
            marginLeft: 0,
            width: '40%',
            float: 'left'
          }}
          id="outlined-textarea" label="Tên dịch vụ, chuyên khoa thực hiện" 
          // multiline
          placeholder="Tên dịch vụ, chuyên khoa thực hiện"
          className={classes.textField}
          value={this.state.queryString}
          onChange={(event) => this.handleChangeFilter(event, 1)}
          margin="normal" variant="outlined"
        />
        {/* <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel style={{ top: 8, backgroundColor: "#FFF" }}
            ref={ref => {
              this.InputLabelRef = ref;
            }}
            htmlFor="outlined-age-simple"
          >
            Loại dịch vụ
          </InputLabel>
          <Select
            value={serviceTypeId}
            onChange={(event) => this.handleChangeFilter(event, 2)}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="age"
                id="outlined-age-simple"
              />
            }

            style={{ width: 150, marginTop: 8, height: 55, textAlign: "left" }}>
            <MenuItem value={-1}>Tất cả</MenuItem>
            {

              services && services.length && services.map((service, index) =>
                service && service.serviceType.length && service.serviceType.map((option, key) => <MenuItem key={index} value={option.id}>{option.name}</MenuItem>)
              )
            }


          </Select>
        </FormControl> */}
        <Button className="button-new" variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>
      </div>
    )
  }
  // handleDelete() {
  //   debugger
  //   this.showPopup()
  // }
  // showPopup() {
  //   this.setState({ open: true });

  // }
  // closePopup() {
  //   this.setState({ isOpen: this.state.isOpen });
  // }


  render() {
    const { classes, render } = this.props;;
    const { open, dataUser, data, page, size, total, progress, stt, listGender, listTitle, listDegree, listSpecialist, services, service } = this.state;
    // debugger
    return (
      <div>
        <Paper className={classes.root + ' page-wrapper  head-vender'}>
          <div className={classes.tableWrapper}>

            
            <h2 className="title-page">Quản lý dịch vụ</h2>
              <div className="tool-bar">
                <EnhancedTableToolbar
                numSelected={0}
                actionsChiren={
                  this.renderChirenToolbar()
                }
              />
              </div>
            {progress ? <LinearProgress /> : null}
            <Table aria-labelledby="tableTitle" className={classes.table + ' table-service'}>
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '100px'}}>STT</TableCell>
                  <TableCell>Tên dịch vụ
                    <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                      <SortByAlphaIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Mã dịch vụ</TableCell>
                  <TableCell >Loại dịch vụ
                    {/* <IconButton onClick={() => this.sortTypeService()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                      <SortByAlphaIcon />
                    </IconButton> */}
                  </TableCell>
                  <TableCell>Chuyên khoa thực hiện</TableCell>
                  <TableCell>Giá tiền</TableCell>
                  <TableCell>Ngày tạo
                    <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                      <SortIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Sắp xếp  độ ưu tiên

                  <IconButton onClick={() => this.PriorityNumber()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                      <SortByAlphaIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services && services.length ? services.map((service, index) => {
                  return (

                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}>
                      <TableCell >{index + stt}</TableCell>
                      <TableCell style={{fontWeight: '700'}}>{service.service.name}</TableCell>
                      <TableCell style={{wordBreak: 'break-all',     width: '18%'}}>{service.service.describe}</TableCell>
                      <TableCell >{service.service.code}</TableCell>
                      <TableCell>
                        {

                          service.serviceType.length > 3 ? service.serviceType.map((serviceType, index) => serviceType.name).filter((item, index) => { return index < 3 }).join(', ') + '...' :
                            service.serviceType.map((serviceType, index) => serviceType.name).join(', ')
                        }
                      </TableCell>

                      <TableCell>
                        {/* {
                          
                          service.specialist.length > 3 ? '3 item + ...':
                          service.specialist.map((special, index) => special.name).join(', ')
                          
                        } */}

                        {

                          service.specialist.length > 3 ? service.specialist.map((special, index) => special.name).filter((item, index) => { return index < 3 }).join(', ') + '...' :
                            service.specialist.map((special, index) => special.name).join(', ')
                        }
                      </TableCell>
                      <TableCell >{parseInt(service.service.price).formatPrice()} đ</TableCell>
                      <TableCell >{moment(service.service.createdDate).format("DD-MM-YYYY")} </TableCell>


                      <TableCell style={{paddingLeft: '5%'}}>{service.service.number}</TableCell>
                      <TableCell style={{ width: '150px' }}>
                        <IconButton onClick={() => this.modalCreateUpdate(service)} type="edit" color="primary" className={classes.button} aria-label="EditIcon">
                        <img src="/icon/edit1.png" alt=""/>
                        </IconButton>
                        {/* <IconButton onClick={() => this.deleteService(service.service.id)} type="delete" color="primary" className={classes.button} aria-label="Delete">
                            <Delete />
                            {service.service.id}
                          </IconButton> */}
                        <IconButton onClick={() => {
                          this.setState({
                            isOpen: true,
                            currentService: service,
                            currentName: service.service.name
                          });
                        }} type="delete" color="primary" className={classes.button} aria-label="Delete">
                          <img src="/icon/delete.png" alt=""/>

                        </IconButton>

                      </TableCell>
                    </TableRow>


                  );
                }) :
                  <TableRow>
                    <TableCell colSpan="9">{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                  </TableRow>
                }

              </TableBody>
              {this.state.isOpen ?
                <div className="backdrop">
                  <div className="modal-popup">
                    <h6>

                      Bạn có chắc chắn muốn xóa dịch vụ {this.state.currentName} ra khỏi danh sách?
                    </h6>
                    <div className="modal-footer">
                      <button className="btn btn-primary" onClick={() => this.deleteService()} >Đồng ý</button>
                      {/* <button className="btn btn-default" onclick={this.closePopup.bind(this)} >Hủy</button> */}
                      <button className="btn btn-default" onClick={() => { this.closePopup() }} >Hủy</button>
                    </div>
                  </div>


                </div> :
                ''}
              {/* <TableFooter>
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
              </TableFooter> */}
            </Table>
          </div>

        </Paper>

        {/* <div>{JSON.stringify(this.state.services)}</div> */}
        {this.state.modalAdd && <ModalAddUpdate data={service} callbackOff={this.closeModal.bind(this)} type="add" />}
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