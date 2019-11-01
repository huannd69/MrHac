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
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import TablePaginationActions from '../../components/pagination/pagination';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Link } from 'react-router-dom'
import hospitalProvider from '../../../../data-access/hospital-provider';
import ModalAddUpdate from './create-update-ticket';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import EnhancedTableToolbar from '../../components/table-toolbar';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
// import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from 'react-select';
class ticketController extends Component {
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
            dataTicket: [],
            startDate: '',
            endDate: '',
            dateFilter: ''
        }
        this.dataTicket = []
    }

    componentDidMount() {
        // this.loadPage();
        // this.loadTotalUser();
        this.loadHospital()
    }
    loadHospital = () => {
        hospitalProvider.searchWithOutPageSize().then(s => {
            if (s && s.code == 0 && s.data) {
                if (s && s.code == 0 && s.data) {
                    let value = ''
                    let label = ''
                    let options = []
                    for (var i = 0; i < s.data.data.length; i++) {
                        value = s.data.data[i].hospital.id
                        label = s.data.data[i].hospital.name
                        options.push({ value, label })
                    }
                    this.setState({
                        options
                    })

                }
            } else {
                this.setState({
                    options: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
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
    loadPage = () => {
        // setTimeout(() => {
        //     this.setState({
        //         data: [],
        //     })
        // }, 1000);
        let startDate = this.state.startDate
        let endDate = this.state.endDate
        let hospitalId = this.state.hospitalId
        hospitalProvider.getTicketInfo(startDate, endDate, hospitalId).then(res => {

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
    onLoadData = () => {
        this.setState({ dateFilter: '' })
        let startDate = this.state.startDate
        let endDate = this.state.endDate
        let hospitalId = this.state.selectedOption.value
        if (startDate && endDate && hospitalId) {
            hospitalProvider.getTicketInfo(startDate, endDate, hospitalId).then(res => {


                if (res.data) {
                    this.setState({
                        dataTicket: res.data,
                    })
                    this.dataTicket = res.data
                }
            }).catch(err => {

            })
        }
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
    selectFromDate = (date) => {
        let startDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
        this.setState({
            startDate: startDate
        }, () => {
            this.onLoadData()
        })
    }
    selectToDate = (date) => {
        let endDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
        this.setState({
            endDate: endDate
        }, () => {
            this.onLoadData()
        })
    }

    handleChangeFilter(event, action) {
        this.setState({
            page: 0,
            hospitalId: event.target.value
        }, () => {
            this.onLoadData()
        })

    }
    handleChange = selectedOption => {
        this.setState({ selectedOption });

    };

    filterDate = (date) => {
        let dateFilter = moment(date).format('YYYY-MM-DD')
        let data = []
        let dataTicket = [...this.dataTicket]

        if (dataTicket && dataTicket.length > 0) {
            data = dataTicket.filter(item => moment(item.date).format('YYYY-MM-DD') == dateFilter)
        }
        this.setState({ dateFilter, dataTicket: data })



    }
    formatDate = date => isNaN(date) ? "Chọn ngày" : moment(date).format("DD-MM-YYYY")

    renderChildren = () => {
        const { classes } = this.props;
        const {
            endDate,
            startDate,
            hospitalId,
            options,
            dataTicket,
            dateFilter,
            selectedOption
        } = this.state;

        return (<div>
            <Grid container spacing={16} >
                <Grid item xs={12} md={3}  >
                    <Select
                        placeholder={'Chọn cơ sở y tế'}
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={options}
                    />
                </Grid>
                <Grid item xs={12} md={1} >
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            value={startDate}
                            label="Từ ngày"
                            variant="outlined"
                            onChange={this.selectFromDate}
                            leftArrowIcon={<KeyboardArrowLeft />}
                            rightArrowIcon={<KeyboardArrowRight />}
                            labelFunc={this.formatDate}
                            maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                            minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} md={1} >
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                            value={endDate}
                            label="Đến ngày"
                            minDate={startDate}
                            variant="outlined"
                            onChange={this.selectToDate}
                            leftArrowIcon={<KeyboardArrowLeft />}
                            rightArrowIcon={<KeyboardArrowRight />}
                            labelFunc={this.formatDate}
                            maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                            minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Button className="button-new" variant="contained" color="primary" onClick={this.onLoadData} style={{ marginLeft: 20, marginTop: 17 }}>Tìm kiếm</Button>
                <Grid item xs={12} md={5} >
                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <DatePicker
                            value={dateFilter}
                            label="Thời gian lọc"
                            variant="outlined"
                            onChange={this.filterDate}
                            leftArrowIcon={<KeyboardArrowLeft />}
                            rightArrowIcon={<KeyboardArrowRight />}
                            labelFunc={this.formatDate}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} md={11}>
                    <h4>
                        Tổng lượt lấy số: {dataTicket && dataTicket.length}
                    </h4>
                </Grid>
            </Grid>

        </div>)
    }
    render() {
        const { classes } = this.props;
        const { dataTicket, page, size, total, progress, stt } = this.state;
        return (
            <div>
                <div className={classes.tableWrapper}>
                    <div className="link-user-tracking-group">
                        <Link to="ticket">
                            <span className="title-page-user-tracking">
                                Thiết lập giờ
                </span>
                        </Link><span>|</span>
                        <Link to="/admin/ticket-controller"><span style={{ color: 'black', borderBottom: '1px' }} className="title-page-user-tracking">
                            Quản lý tài khoản lấy số
                </span></Link>
                    </div>
                    <EnhancedTableToolbar
                        title=""
                        numSelected={0}
                        actionsChiren={
                            this.renderChildren()
                        }
                    />
                    {progress ? <LinearProgress /> : null}
                    <div className="table-wrapper">
                        <Table aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Tên người bệnh</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Số đã lấy</TableCell>
                                    <TableCell>Thời gian lấy</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dataTicket && dataTicket.length ? dataTicket.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell style={{ wordBreak: "break-all" }}>
                                                    {item.patientName ? item.patientName : ''}
                                                </TableCell>
                                                <TableCell style={{ wordBreak: "break-all" }}>
                                                    {item.phone ? item.phone : ''}
                                                </TableCell>
                                                <TableCell style={{ wordBreak: "break-all" }}><MuiPickersUtilsProvider utils={MomentUtils}>
                                                    {item.number ? item.number : ''}
                                                </MuiPickersUtilsProvider></TableCell>
                                                <TableCell style={{ wordBreak: "break-all" }}><MuiPickersUtilsProvider utils={MomentUtils}>
                                                    {item.date ? moment(item.date).format("DD-MM-YYYY") : ''}
                                                </MuiPickersUtilsProvider></TableCell>
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell>{dataTicket ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
            </div>

        );
    }
}

function getStyles(name, that) {
    return {
        fontWeight:
            that.state.name.indexOf(name) === -1
                ? that.props.theme.typography.fontWeightRegular
                : that.props.theme.typography.fontWeightMedium,
    };
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
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
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(ticketController));
