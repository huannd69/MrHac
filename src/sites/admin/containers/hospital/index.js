import React, { Component } from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import TextField from '@material-ui/core/TextField';
import TablePaginationActions from '../../components/pagination/pagination'
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import DateUtils from 'mainam-react-native-date-utils';
import EnhancedTableToolbar from '../../components/table-toolbar';
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalAddUpdate from './create-update-hospital';
import DetailHospital from './detail-hospital';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import zoneProvider from '../../../../data-access/zone-provider';
import provinceProvider from '../../../../data-access/province-provider';
import districtProvider from '../../../../data-access/district-provider';
import { getListReport, confirmReport, deleteReport } from '../../../../utils/apiAxios'

class Hospital extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            size: 20,
            stringQuyery: '',
            type: -1,
            data: [],
            total: 0,
            selected: [],
            numSelected: 0,
            dataHospital: {},
            progress: true,
            modalDetailHospital: false,
            modalAdd: false,
            active: 1,
            labelWidth: 0,

            listProvince: [
                {
                    id: -1,
                    countryCode: '--- Chọn Tỉnh / Thành phố (*) ---'
                }
            ],
            listDistrict: [
                {
                    id: -1,
                    name: '--- Chọn Quận / Huyện (*) ---'
                }
            ],
            listZone: [
                {
                    id: -1,
                    name: '--- Chọn Xã / Phường / Thị trấn ---'
                }
            ],
            provinceId: -1,
            districtId: -1,
            zoneId: -1,
            checkLoad: false
        }
    }

    loadPage() {
        getListReport(this.props.userApp.currentUser.token).then(res => {
            console.log(res)
            this.setState({
                listData: res.data,
                progress: false
            })

        }).catch(err => {
            this.setState({ progress: false })

        })
    }

    loadProvince() {
        provinceProvider.getAll().then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [
                    {
                        id: -1,
                        countryCode: '--- Chọn Tỉnh / Thành phố (*) ---'
                    }
                ]
                for (var i = 0; i < s.data.provinces.length; i++) {
                    dataTemp.push(s.data.provinces[i])
                }
                this.setState({
                    listProvince: dataTemp
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    // componentWillMount() {
    //    
    //     const urlParams = new URLSearchParams(this.props.location.search);
    //     const idUser = urlParams.get('id');
    //     this.setState({ idUser })
    //     this.props.history.replace(this.props.location.pathname);
    //     this.loadProvince();
    // }

    componentDidMount() {
        // this.setState({
        //   labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        // });
        // if (this.state.idUser) {
        //     this.getDetail(this.state.idUser);
        // }
        this.loadPage();

    }


    getDetail(id) {
        hospitalProvider.getDetail(id).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    dataUser: s.data,
                })
                this.modalDetailHospital(s.data);
                console.log(s, 'áđâsđâsd', id);
            }
        }).catch(e => {
        })
    }


    modalDetailHospital(item) {
        if (this.state.viewable) {
            this.setState({ modalDetailHospital: true, dataHospital: item })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    callbackDelete(text) {
        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    clearTimeOutAffterRequest = null

    modalCreateUpdate(item) {
        if (item) {
            if (this.state.updateable) {
                this.setState({
                    modalAdd: true,
                    dataHospital: item,
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
                    dataHospital: {},
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
        this.setState({ modalDetailHospital: false, modalAdd: false });
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

    handleChangeFilter(event, index) {
        // this.setState({
        //     page: 0,
        //     data: []
        // }, () => {
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
        if (index == 2) {
            this.setState({
                page: 0,
                active: event.target.value,
                data: []
            }, () => {
                this.loadPage();
            })
        }
        // });

    }

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

    sortUsername() {
        switch (this.state.type) {
            case 2:
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
                    type: 2
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
                    value={stringQuyery}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                />
                <FormControl variant="outlined" className={classes.formControl}>
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
                </FormControl>
                {
                    createable ?
                        <Button className="button-new" variant="contained" color="secondary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20, marginTop: 17 }}>Thêm mới</Button>
                        : null
                }
            </div>
        )
    }
    onConfirm = (item) => {
        let id_report = item._id
        let token = this.props.userApp.currentUser.token
        confirmReport(id_report, token).then(res => {
            toast.success("Xác nhận báo cáo khẩn cấp thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        })

    }
    onDelete = (item) => {
        let id_report = item._id
        let token = this.props.userApp.currentUser.token
        deleteReport(id_report, token).then(res => {
            toast.success("Xóa báo cáo khẩn cấp thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
        })
    }
    render() {
        const { classes } = this.props;
        const { stt, page, size, selected, progress, data, total, dataHospital, listData, updateable, createable, listDistrict, listProvince, listZone } = this.state;
        return (
            <div>
                <Paper className={classes.root + ' admin-page hospital'}>
                    <div className={classes.tableWrapper}>
                        <h2 className="title-page">Quản lý báo cáo khẩn cấp</h2>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            title=""
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
                                        <TableCell style={{ width: "15%" }}>User
                                            <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                <SortByAlphaIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>Báo cáo khẩn cấp</TableCell>
                                        <TableCell>Ngày giờ gửi
                                            <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                                                <SortIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>Bác sĩ</TableCell>
                                        {/* <TableCell>Username
                                            <IconButton onClick={() => this.sortUsername()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                        <SortByAlphaIcon />
                                                    </IconButton>
                                                </TableCell> */}
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Xử lý</TableCell>
                                        {/* <TableCell>Thao tác</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {listData && listData.length ? listData.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell onClick={() => this.modalDetailHospital(item)}>{index + 1}</TableCell>
                                                <TableCell onClick={() => this.modalDetailHospital(item)} style={{ wordBreak: "break-all" }}>
                                                    {item.user.name}
                                                </TableCell>
                                                <TableCell onClick={() => this.modalDetailHospital(item)}>
                                                    {item.content}
                                                </TableCell>
                                                <TableCell onClick={() => this.modalDetailHospital(item)}>
                                                    {moment(item.create_at).format("DD-MM-YYYY HH:MM:SS")}
                                                </TableCell>

                                                <TableCell onClick={() => this.modalDetailHospital(item)}>
                                                    {item.doctor.name}
                                                </TableCell>
                                                <TableCell onClick={() => this.modalDetailHospital(item)}>
                                                    {item.status}
                                                </TableCell>
                                                {/* {
                                                            item.userAdmin && item.userAdmin.username ?
                                                                <TableCell onClick={() => this.modalDetailHospital(item)}>
                                                                    {item.userAdmin.username}
                                                                </TableCell>
                                                                : <TableCell></TableCell>
                                                        } */}


                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => this.onConfirm(item)}
                                                        color="inherit"
                                                    >
                                                        <img src="/images/icon/arrowPointToRight.png" alt="" />
                                                    </IconButton>
                                                    <IconButton onClick={() => this.onDelete(item)} color="primary" className={classes.button} aria-label="IconRefresh">
                                                        <img alt="" src="/images/icon/delete.png" />
                                                    </IconButton>

                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) :
                                        <TableRow>
                                            <TableCell>{this.state.stringQuyery ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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

                    {this.state.modalAdd && <ModalAddUpdate data={dataHospital} province={listProvince} district={listDistrict} zone={listZone} callbackOff={this.closeModal.bind(this)} />}
                    {this.state.modalDetailHospital && <DetailHospital data={dataHospital} province={listProvince} district={listDistrict} zone={listZone} callbackOff={this.closeModal.bind(this)} />}
                </Paper>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}

const styles = theme => ({
    root: {
        // width: '100%',
        // marginTop: theme.spacing.unit * 3,
        display: 'flex',
        flexWrap: 'wrap',
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    }, contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },

});

Hospital.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Hospital));