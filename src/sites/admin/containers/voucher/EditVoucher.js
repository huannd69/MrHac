import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import EnhancedTableToolbar from '../../components/table-toolbar';
// import TablePaginationActions from '../../components/pagination/pagination';
// import ConfirmDialog from '../../components/confirm';
// import roleProvider from '../../../../data-access/role-provider';
import voucherProvider from '../../../../data-access/voucher-provider'

import { connect } from 'react-redux';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { toast } from 'react-toastify';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
// import { red } from '@material-ui/core/colors';
// import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
// import LinearProgress from '@material-ui/core/LinearProgress';
// import Table from '@material-ui/core/Table';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TableCell from '@material-ui/core/TableCell';
// import TableBody from '@material-ui/core/TableBody';
// import TableFooter from '@material-ui/core/TableFooter';
// import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
// import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import SortIcon from '@material-ui/icons/Sort';
// import DeleteIcon from '@material-ui/icons/Delete';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
// import Clear from '@material-ui/icons/Clear';
// import Loop from '@material-ui/icons/Loop';
// import { makeStyles } from '@material-ui/core/styles';
// import FilledInput from '@material-ui/core/FilledInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import Chip from '@material-ui/core/Chip';



class EditVoucher extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props.userApp.currentUser.permission);
        // let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 3).length > 0;

        this.state = {
            page: 0,
            size: 20,
            phone: '',
            name: '',
            deviceType: 0,
            style: 3,
            sort: true,
            total: 0,
            labelWidth: 0,
            userStatus: 0,
            dataDetail: {},
            progress: false,
            modalAdd: false,
            modalDetailtSpecialist: false,
            confirmDialog: false,
            tempDelete: [],
            data: this.props.data,
            fromDate: this.props.history.location.state.dataItem.startTime,
            toDate: this.props.history.location.state.dataItem.endTime,
            userType: 0,
            voucherCode: this.props.history.location.state.dataItem.code,
            voucherPrice: this.props.history.location.state.dataItem.price,
            voucherQuantity: this.props.history.location.state.dataItem.quantity,
            voucherType: this.props.history.location.state.dataItem.type,
            voucherStatus: this.props.history.location.state.dataItem.deleted,
            dataItem: this.props.history.location.state.dataItem
        }
    }


    componentWillMount() {
        // this.createCode()
    }


    closeDate(event) {
        if (event === 1) {
            this.setState({
                fromDate: ''
            })
        }
        if (event === 2) {
            this.setState({
                toDate: ''
            })
        }
    }


    editVoucher = () => {

        let fdate = this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD HH:mm:ss').toString() : null
        let tdate = this.state.toDate ? moment(this.state.toDate).format('YYYY-MM-DD HH:mm:ss').toString() : null

        let param = {
            'code': this.state.voucherCode,
            'id': this.state.dataItem.id,
            'price': this.state.voucherPrice,
            'quantity': this.state.voucherQuantity >= 0 && this.state.voucherQuantity !== '' ? this.state.voucherQuantity :null
            ,
            'type': this.state.voucherType,
            'deleted': this.state.voucherStatus,
            'startTime': fdate < tdate ? fdate : null,
            'endTime': fdate < tdate ? tdate : null
        }
        voucherProvider.editVoucher(param)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    console.log(s.data)
                    toast.success('Sửa voucher ' + s.data.code + ' thành công', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.props.history.push("/admin/voucher");

                } else {
                    toast.error('Xin thử lại', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })

            .catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })


    }

    render() {
        const { classes } = this.props;
        const {
            // data,
            // progress,
            // userType,
            voucherCode,
            voucherPrice,
            voucherQuantity,
            voucherType,
            voucherStatus,
            fromDate,
            toDate,
            dataItem

        } = this.state;

        return (
            <div>
                <Paper style={{ paddingBottom: 30 }} className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <h2 className="title-page">
                            Sửa voucher
                        </h2>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item xs={12} md={2}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="component-helper">Tên Mã Voucher</InputLabel>
                                    <Input
                                        disabled
                                        id="component-helper"
                                        value={voucherCode}
                                        // onChange={(event) => {
                                        //     this.setState({ voucherCode: event.target.value.toUpperCase() });
                                        // }}
                                        aria-describedby="component-helper-text"
                                    />
                                    <FormHelperText id="component-helper-text">Nhập tên mã voucher</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-chip">Loại voucher</InputLabel>
                                    <Select
                                        disabled
                                        value={voucherType}
                                        // onChange={(event) => {
                                        //     this.setState({ voucherType: event.target.value });
                                        // }}
                                        input={<Input name="age" id="age-helper" />}
                                    >
                                        <MenuItem value={0}>Tất cả user</MenuItem>
                                        <MenuItem value={1}>Nhóm khách hàng</MenuItem>
                                        <MenuItem value={2}>Nhập mã</MenuItem>
                                    </Select>
                                    <FormHelperText id="component-helper-text">Chọn loại voucher</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="component-helper">Giá trị voucher (VND)</InputLabel>
                                    <Input
                                        disabled
                                        type='number'
                                        id="component-helper"
                                        value={voucherPrice}
                                        // onChange={(event) => {
                                        //     this.setState({ voucherPrice: event.target.value });
                                        // }}
                                        aria-describedby="component-helper-text"
                                    />
                                    <FormHelperText id="component-helper-text">Nhập giá trị cho voucher</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                {dataItem.type === 2 ?
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Số lần sử dụng</InputLabel>
                                        <Input
                                            disabled
                                            type='number'
                                            id="component-helper"
                                            placeholder="1"
                                            value={1}

                                        />
                                        <FormHelperText id="component-helper-text">Số lần sử dụng</FormHelperText>
                                    </FormControl>
                                    :

                                    dataItem.type === 1 ?
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="component-helper">Số lần sử dụng</InputLabel>
                                            <Input
                                                disabled
                                                type='number'
                                                id="component-helper"
                                                placeholder="1"
                                                value={100000}

                                            />
                                            <FormHelperText id="component-helper-text">Số lần sử dụng</FormHelperText>
                                        </FormControl>
                                        :
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="component-helper">Số lần sử dụng</InputLabel>
                                            <Input
                                                type='number'
                                                id="component-helper"
                                                value={voucherQuantity}
                                                onChange={(event) => {
                                                    this.setState({ voucherQuantity: event.target.value });
                                                }}
                                                aria-describedby="component-helper-text"
                                            />
                                            <FormHelperText id="component-helper-text">Nhập số lần sử dụng</FormHelperText>
                                        </FormControl>
                                }
                            </Grid>
                            
                            <Grid item xs={12} md={2}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-chip">Trạng thái</InputLabel>
                                    <Select
                                        value={voucherStatus}
                                        onChange={(event) => {
                                            this.setState({ voucherStatus: event.target.value });
                                        }}
                                        input={<Input name="age" id="age-helper" />}
                                    >
                                        <MenuItem value={0}>Đang hoạt động</MenuItem>
                                        <MenuItem value={1}>Tạm dừng</MenuItem>
                                    </Select>
                                    <FormHelperText id="component-helper-text">Chọn trạng thái cho voucher</FormHelperText>
                                </FormControl>
                            </Grid>

                            <Grid
                                style={{ padding: 50 }}
                                container className={classes.root}
                                spacing={8} direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Grid item xs={12} md={2}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            disabled
                                            value={fromDate}
                                            maxDate={toDate}
                                            label="Từ ngày"
                                            variant="outlined"
                                            style={{ marginTop: 17, width: "110%", marginLeft: -7 }}
                                            onChange={(date) => {
                                                this.setState({ fromDate: date });
                                            }}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('YYYY-MM-DD')}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <TimePicker
                                            disabled
                                            margin="normal"
                                            label="Từ giờ"
                                            value={fromDate}
                                            variant="outlined"
                                            onChange={(date) => {
                                                this.setState({ fromDate: date });
                                            }}
                                            labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('HH:mm:ss')}
                                            style={{ marginLeft: -3, marginTop: 17 }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                {/* <Grid>
                                    <div style={{ marginLeft: -42, marginTop: 13 }}>
                                        <IconButton onClick={() => this.closeDate(1)} color="primary" className={classes.button} aria-label="Loop">
                                            <Loop />
                                        </IconButton>
                                    </div>
                                </Grid> */}
                                <Grid item xs={12} md={2}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={toDate}
                                            label="Đến ngày"
                                            minDate={fromDate}
                                            variant="outlined"
                                            style={{ marginTop: 17, width: "110%" }}
                                            onChange={(date) => {
                                                this.setState({ toDate: date });
                                            }}
                                            // onChange={(date) => this.handleChangeFilter(date, 2)}
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('YYYY-MM-DD')}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <TimePicker
                                            margin="normal"
                                            label="Đến giờ"
                                            value={toDate}
                                            minDate={fromDate}
                                            variant="outlined"
                                            onChange={(date) => {
                                                this.setState({ toDate: date });
                                            }}
                                            labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('HH:mm:ss')}
                                            style={{ marginLeft: 5, width: '110%', marginTop: 17 }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                {/* <Grid>
                                    <div style={{ marginLeft: -42, marginTop: 13 }}>
                                        <IconButton onClick={() => this.closeDate(2)} color="primary" className={classes.button} aria-label="Loop">
                                            <Loop />
                                        </IconButton>
                                    </div>
                                </Grid> */}
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Button onClick={() => this.props.history.push("/admin/voucher")} style={{ marginRight: 20 }} variant="contained" >Hủy bỏ</Button>
                                <Button variant="contained" color="primary" onClick={this.editVoucher}>Xác nhận</Button>
                            </Grid>


                        </Grid>
                    </div>
                </Paper>
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
        padding: 30
    },
    // table: {
    //     minWidth: 2048,
    // },
    // tableWrapper: {
    //     overflowX: 'auto',
    // },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(connect(mapStateToProps)(EditVoucher));