import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import EnhancedTableToolbar from '../../components/table-toolbar';
import voucherProvider from '../../../../data-access/voucher-provider';
import hospitalProvider from '../../../../data-access/hospital-provider';
import DetailUsage from './detail-usage';
// import TablePaginationActions from '../../components/pagination/pagination';
// import ConfirmDialog from '../../components/confirm';
// import roleProvider from '../../../../data-access/role-provider';
// import userProvider from '../../../../data-access/user-provider';


import { connect } from 'react-redux';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
// import { Link } from 'react-router-dom';
// import MomentUtils from '@date-io/moment';
// import { ToastContainer, toast } from 'react-toastify';
// import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
// import SortIcon from '@material-ui/icons/Sort';
// import DeleteIcon from '@material-ui/icons/Delete';
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
// import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
// import Clear from '@material-ui/icons/Clear';
// import Loop from '@material-ui/icons/Loop';
// import TablePagination from '@material-ui/core/TablePagination';
// import { red } from '@material-ui/core/colors';




class Voucher extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props.userApp.currentUser.permission);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value === 3).length > 0;

        this.state = {
            page: 0,
            size: 20,
            deviceType: 0,
            fromDate: '',
            toDate: '',
            style: 3,
            total: 0,
            progress: false,
            modalAdd: false,
            confirmDialog: false,
            modalDetail: false,
            data: [],
            voucherStatus: -2,
            voucherCode: '',
            voucherId: null,
            voucherType: -2,
            hospitalId: 153,
            viewable
        }
    }

    componentDidMount() {
        this.loadPage();
        this.listHospital()
    }


    // handleChangePage = (event, action) => {
    //     this.setState({
    //         page: action,
    //         selected: []
    //     }, () => {
    //         this.getList()
    //     });
    // };

    // handleChangeRowsPerPage = event => {
    //     this.setState({ size: event.target.value }, () => {
    //         this.getList()
    //     });
    // };


    loadPage = () => {
        let param = {
            type: this.state.voucherType,
            code: this.state.voucherCode.toUpperCase(),
            status: this.state.voucherStatus
        }
        voucherProvider.search(param)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    this.setState({
                        data: s.data,
                    });
                    
                } else {
                    this.setState({
                        data: []
                    })
                }

            }).catch(e => {
            })
    }

    handleChangeFilter(event, action) {
        if (action === 1) {
            this.setState({
                page: 0,
                voucherType: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.loadPage()
                }, 100)
            })
        }

        if (action === 2) {
            this.setState({
                page: 0,
                voucherStatus: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action === 3) {
            this.setState({
                page: 0,
                voucherCode: event.target.value
            })
        }
        if (event.key === "Enter" && action === 4) {
            this.loadPage();
        }
        if (action === 4) {
            this.setState({
                page: 0,
                hospitalId: event.target.value
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
            if (s && s.code === 0 && s.data) {
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

    renderChirenToolbar() {
        const { classes } = this.props;
        const {
            // toDate,
            // fromDate,
            // name,
            // deviceType,
            voucherType,
            voucherCode,
            voucherStatus,
            listHospital,
            hospitalId

        } = this.state;
        return (
            <div className="tool-bar-booking">
                <Grid container spacing={16}>
                    <Grid item xs={12} md={4}>
                        <Button
                            onClick={() => this.props.history.push("/admin/add-voucher")}
                            style={{ padding: 15, marginTop: 16, float: 'left' }}
                            variant="contained" color="primary"
                            className={classes.button}
                        >
                            <AddIcon />Thêm voucher
                            </Button>
                        <Button
                            onClick={() => this.props.history.push("/admin/import-voucher-user")}
                            style={{ padding: 15, marginTop: 16, marginLeft: 16, float: 'left' }}
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                        > <AddIcon /> Thêm user</Button>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-chip">Loại voucher</InputLabel>
                            <Select
                                variant="outlined"
                                value={voucherType}
                                onChange={(event) => this.handleChangeFilter(event, 1)}
                                input={<Input name="age" id="age-helper" />}
                            >
                                <MenuItem value={-2}>Tất cả</MenuItem>
                                <MenuItem value={0}>Tất cả user</MenuItem>
                                <MenuItem value={1}>Nhóm khách hàng</MenuItem>
                                <MenuItem value={2}>Nhập mã</MenuItem>
                            </Select>
                            <FormHelperText id="component-helper-text">Tìm kiếm theo loại voucher</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-chip">Trạng thái</InputLabel>
                            <Select
                                variant="outlined"
                                value={voucherStatus}
                                onChange={(event) => this.handleChangeFilter(event, 2)}
                                input={<Input name="age" id="age-helper" />}
                            >
                                <MenuItem value={-2}>Tất cả</MenuItem>
                                <MenuItem value={0}>Đang hoạt động</MenuItem>
                                <MenuItem value={1}>Tạm dừng</MenuItem>
                            </Select>
                            <FormHelperText id="component-helper-text">Tìm kiếm theo trạng thái voucher</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl + " litmit-select"}
                            style={{ marginTop: 17 }}
                        >
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
                                onChange={(event) => this.handleChangeFilter(event, 4)}
                                input={
                                    <OutlinedInput
                                        labelWidth={200}
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

                    <Grid item xs={12} md={2}>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl + " litmit-select"}
                        >
                            <TextField
                                id="outlined-textarea"
                                label="Tìm kiếm voucher "
                                placeholder="Mã voucher"
                                multiline={false}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                autoFocus={true}
                                fullwidth="true"
                                value={voucherCode}
                                onChange={(event) => this.handleChangeFilter(event, 3)}
                                onKeyPress={(event) => this.handleChangeFilter(event, 4)}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        );
    }
    closeModal() {
        this.loadPage();
        this.setState({ modalDetail: false });
    }

    modalDetail(item) {
        this.setState({ modalDetail: true, voucherId: item })
    }

    render() {
        const { classes } = this.props;
        const {
            data,
            // page,
            // size,
            progress,
            viewable,
            voucherStatus,
            voucherId,
            voucherCode,
            voucherType

        } = this.state;

        return (
            <div>
                <Paper className={classes.root + ' admin-page special-page'}>
                    {
                        viewable ?
                            <div className={classes.tableWrapper}>
                                <div className="link-user-tracking-group">

                                    <span
                                        style={{ color: 'black', borderBottom: '1px' }}
                                        className="title-page-user-tracking">
                                        Quản lý Voucher
                                    </span>
                                </div>

                                <EnhancedTableToolbar
                                    title=""
                                    numSelected={0}
                                    actionsChiren={this.renderChirenToolbar()}
                                />
                                {progress ? <LinearProgress /> : null}
                                <div className="table-wrapper">
                                    <Table aria-labelledby="tableTitle">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tên mã voucher</TableCell>
                                                <TableCell>Giá trị voucher (đ)</TableCell>
                                                <TableCell>Số lần sử dụng</TableCell>
                                                <TableCell>Loại voucher</TableCell>
                                                <TableCell>Thời gian áp dụng</TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell>Các tài khoản đã dùng voucher</TableCell>
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
                                                            <TableCell>
                                                                {item.code}
                                                                <IconButton
                                                                        color='primary'
                                                                        onClick={() => this.props.history.push({
                                                                            pathname: '/admin/edit-voucher/' + item.id,
                                                                            state: { dataItem: item }
                                                                        })}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>

                                                            </TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>{item.price.formatMoney()}</TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>{item.counter + '/' + item.quantity}</TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>
                                                                {
                                                                    item.type === 0 ? 'Tất cả user'
                                                                        : item.type === 1 ? 'Nhóm khách hàng'
                                                                            : item.type === 2 ? 'Nhập mã'
                                                                                : ''
                                                                }
                                                            </TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}><span>{"Từ: " + moment(item.startTime).format('HH:mm:ss DD-MM-YYYY')}</span><br /><span>{"Đến: "+ moment(item.endTime).format('HH:mm:ss DD-MM-YYYY')}</span></TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>
                                                            
                                                                {item.deleted === 0 ?
                                                                    <span style={{ color: 'green' }}>Đang hoạt động</span> : <span style={{ color: 'red' }}>Tạm dừng</span>
                                                                }
                                                            </TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>
                                                                <Button
                                                                    onClick={() => this.modalDetail(item.id)
                                                                    }
                                                                    variant="outlined"
                                                                    className={classes.button}
                                                                >
                                                                    Xem chi tiết
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>

                                                    );
                                                })
                                                    :
                                                    <TableRow>
                                                        <TableCell>{voucherCode||voucherStatus||voucherType ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                                    </TableRow>
                                            }
                                        </TableBody>
                                        <TableFooter>
                                            {/* <TableRow>
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
                                            </TableRow> */}
                                        </TableFooter>
                                    </Table>
                                </div>

                            </div>
                            : "Unauthorized error"}
                </Paper>
                {this.state.modalDetail && <DetailUsage voucherId={voucherId} callbackOff={this.closeModal.bind(this)} handleLoadFilter={this.loadPage.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(Voucher));