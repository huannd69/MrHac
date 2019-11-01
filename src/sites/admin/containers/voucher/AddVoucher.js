import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import EnhancedTableToolbar from '../../components/table-toolbar';
// import TablePaginationActions from '../../components/pagination/pagination';
// import ConfirmDialog from '../../components/confirm';
// import roleProvider from '../../../../data-access/role-provider';
// import userProvider from '../../../../data-access/user-provider';
import voucherProvider from '../../../../data-access/voucher-provider';
// import stringUtils from 'mainam-react-native-string-utils';

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
import InputAdornment from '@material-ui/core/InputAdornment';
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




class AddVoucher extends Component {
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
            fromDate: '',
            toDate: '',
            userType: 0,
            voucherCode: '',
            voucherPrice: '',
            voucherQuantity: '',
            voucherType: '',
            voucherStatus: 0,
            renderAutoCode: false,
            prefix: '',
            charters: '',
            num: '',
            price: ''
        }
    }


    componentWillMount() {

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


    createCode = () => {
        
        let fdate = this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD HH:mm:ss').toString() : null
        let tdate = this.state.toDate ? moment(this.state.toDate).format('YYYY-MM-DD HH:mm:ss').toString() : null

        let param = {
            'code': this.state.voucherCode !== '' ? this.state.voucherCode : null,
            'price': this.state.voucherPrice >= 1000 && this.state.voucherPrice !== '' ? this.state.voucherPrice : null,
            'quantity': this.state.voucherQuantity > 0 && this.state.voucherQuantity !== '' ? this.state.voucherQuantity
                : this.state.voucherType === 2 ? 1 : this.state.voucherType === 1 ? 100000
                    : null
            ,
            'type': this.state.voucherType >= 0 ? this.state.voucherType : null,
            'startTime': fdate < tdate ? fdate : null,
            'endTime': fdate < tdate ? tdate : null
        }
        if (param.code && param.price && param.quantity && param.type>=0 && param.startTime && param.endTime) {
            debugger;
            voucherProvider.createCode(param)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    console.log(s.data)
                    toast.success('Tạo voucher thành công', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.props.history.push("/admin/voucher");
                } else if (s.code === 2) {
                    toast.error(s.message, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
                else {
                    toast.error('Xin vui lòng thử lại', {
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
        else {
            debugger;
            toast.error('Xin vui lòng thử lại', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    handleChangeAdding = () => {
        this.setState({
            renderAutoCode: !this.state.renderAutoCode,
            fromDate: '',
            toDate: ''
        })
    }

    generateCode() {
        console.log(this.state.prefix.length, this.state.charters)
        if (this.state.prefix.length + parseInt(this.state.charters) >= 6 && parseInt(this.state.charters) >= 3 && parseInt(this.state.price) >= 1000) {
            var fdate = this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD HH:mm:ss').toString() : null
            var tdate = this.state.toDate ? moment(this.state.toDate).format('YYYY-MM-DD HH:mm:ss').toString() : null

            var param = {
                'prefix': this.state.prefix !== '' ? this.state.prefix : null,
                'charters': this.state.charters >= 0 ? this.state.charters : null,
                'num': this.state.num > 0 && this.state.num <= 100 ? this.state.num : null,
                'price': this.state.price >= 1000 ? this.state.price : null,
                'startTime': fdate < tdate ? fdate : null,
                'endTime': fdate < tdate ? tdate : null,
            }
        } else {
            param = {
                'prefix': null,
                'charters': null,
                'num': null,
                'price': null,
                'startTime': null,
                'endTime': null,
            }
        }
        voucherProvider.generate(param)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    console.log(s.data)
                    toast.success('Tạo ' + this.state.num + ' voucher thành công', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.props.history.push("/admin/voucher");
                } else {
                    toast.error('Xin vui lòng thử lại', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    console.log(s);
                }
            })
            .catch(e => {
                toast.error('Xin thử lại', {
                    position: toast.POSITION.TOP_RIGHT
                });
                console.log(e);
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
            // voucherStatus,
            fromDate,
            toDate,
            prefix,
            charters,
            num,
            price

        } = this.state;
        console.log(voucherCode, voucherPrice, voucherQuantity, voucherType, fromDate, toDate);
        console.log(prefix, charters, num, fromDate, toDate)
        return (
            <div>
                <Paper style={{ paddingBottom: 30, overflow: 'none' }} className={classes.root}>
                    <div className={classes.tableWrapper}>
                        {this.state.renderAutoCode ? <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleChangeAdding}>Thêm voucher</Button>
                            : <Button variant="contained" color="primary" className={classes.button} onClick={this.handleChangeAdding}>Thêm nhiều voucher</Button>}

                        {this.state.renderAutoCode === false ?

                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <h2 className="title-page">Thêm voucher</h2>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Tên Mã Voucher</InputLabel>
                                        <Input
                                            required
                                            id="component-helper"
                                            value={voucherCode}
                                            onChange={(event) => {
                                                this.setState({ voucherCode: event.target.value.toUpperCase() });
                                            }}
                                            aria-describedby="component-helper-text"
                                        />
                                        <FormHelperText id="component-helper-text">Nhập tên mã voucher</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="select-multiple-chip">Loại voucher</InputLabel>
                                        <Select
                                            variant="outlined"
                                            value={voucherType}
                                            onChange={(event) => {
                                                this.setState({ voucherType: event.target.value });
                                            }}
                                            input={<Input name="age" id="age-helper" />}
                                        >
                                            <MenuItem value={0}>Tất cả user</MenuItem>
                                            <MenuItem value={1}>Nhóm khách hàng</MenuItem>
                                            <MenuItem value={2}>Nhập mã</MenuItem>
                                        </Select>
                                        <FormHelperText id="component-helper-text">Chọn loại voucher muốn thêm</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>


                                    {voucherType === 2 ?
                                        <FormControl className={classes.formControl}>
                                            <InputLabel htmlFor="component-helper">Số lần sử dụng:</InputLabel>
                                            <Input
                                                disabled
                                                type="number"
                                                id="component-helper"
                                                placeholder="1"
                                                value={1}
                                            />
                                            <FormHelperText id="component-helper-text">Số lần sử dụng mã</FormHelperText>
                                        </FormControl>
                                        : voucherType === 1 ?
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="component-helper">Số lần sử dụng:</InputLabel>
                                                <Input
                                                    disabled
                                                    type='number'
                                                    id="component-helper"
                                                    placeholder="1"
                                                    value={100000}
                                                />
                                                <FormHelperText id="component-helper-text">Số lần sử dụng mã</FormHelperText>
                                            </FormControl>
                                            :
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="component-helper">Số lần sử dụng</InputLabel>
                                                <Input
                                                    type="number"
                                                    id="component-helper"
                                                    value={voucherQuantity}
                                                    onChange={(event) => {
                                                        this.setState({ voucherQuantity: event.target.value });
                                                    }}
                                                    aria-describedby="component-helper-text"
                                                    min="1"
                                                />
                                                <FormHelperText id="component-helper-text">Chọn số lần sử dụng mã</FormHelperText>
                                            </FormControl>
                                    }



                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Giá trị voucher</InputLabel>
                                        <Input
                                            type="number"
                                            id="component-helper"
                                            value={voucherPrice}
                                            onChange={(event) => {
                                                this.setState({ voucherPrice: event.target.value });
                                            }}
                                            endAdornment={<InputAdornment position="end">VND</InputAdornment>}
                                            aria-describedby="component-helper-text"
                                            inputProps={{ min: "1000", step: "1000" }}
                                            
                                        />
                                        <FormHelperText id="component-helper-text">Nhập giá trị cho voucher (từ 1000đ trở lên)</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid
                                    style={{ padding: 50 }}
                                    container className={classes.root}
                                    spacing={10} direction="row"
                                    justify="space-between"
                                    alignItems="center"
                                >
                                    <Grid item xs={12} md={2}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <DatePicker
                                                value={fromDate}
                                                label="Từ ngày"
                                                variant="outlined"
                                                style={{ marginTop: 17, width: "110%", marginLeft: -7 }}
                                                onChange={(date) => {
                                                    this.setState({ fromDate: date });
                                                }}
                                                minDate={new Date()}
                                                maxDate={toDate}
                                                leftArrowIcon={<KeyboardArrowLeft />}
                                                rightArrowIcon={<KeyboardArrowRight />}
                                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <TimePicker
                                                margin="normal"
                                                label="Từ giờ"
                                                value={fromDate}
                                                variant="outlined"
                                                minDate={new Date()}
                                                maxDate={toDate}
                                                onChange={(date) => {
                                                    this.setState({ fromDate: date });
                                                }}
                                                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('HH:mm:ss')}
                                                style={{ marginLeft: -3, marginTop: 17 }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                    
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
                                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
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
                                    
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Button onClick={() => this.props.history.push("/admin/voucher")} style={{ marginRight: 20 }} variant="contained" >Hủy bỏ</Button>
                                    <Button variant="contained" color="primary" onClick={() => this.createCode()}>Thêm mới</Button>
                                </Grid>


                            </Grid>
                            :

                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <h2 className="title-page">Thêm nhiều voucher</h2>
                                    <span style={{ float: 'left', color: 'gray', border: '0.5px solid', borderRadius: 5, padding: 10 }}>Loại voucher : <b> Nhập mã</b></span>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Tiền tố</InputLabel>
                                        <Input
                                            required
                                            id="component-helper"
                                            value={prefix}
                                            onChange={(event) => {
                                                this.setState({ prefix: event.target.value.toUpperCase() });
                                            }}
                                            aria-describedby="component-helper-text"
                                        />
                                        <FormHelperText id="component-helper-text">Nhập tiền tố (không bắt buộc) </FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Số lượng kí tự </InputLabel>
                                        <Input
                                            type="number"
                                            required
                                            id="component-helper"
                                            value={charters}
                                            onChange={(event) => {
                                                this.setState({ charters: event.target.value });
                                            }}
                                            inputProps={{ min: "3", step: "1" }}
                                            aria-describedby="component-helper-text"
                                        />
                                        <FormHelperText id="component-helper-text">Nhập số kí tự ( từ 3 kí tự trở lên )</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Số lượng</InputLabel>
                                        <Input
                                            type="number"
                                            required
                                            id="component-helper"
                                            value={num}
                                            onChange={(event) => {
                                                this.setState({ num: event.target.value });
                                            }}
                                            aria-describedby="component-helper-text"
                                            inputProps={{ min: "1",max: "100", step: "10" }}
                                        />
                                        <FormHelperText id="component-helper-text">Nhập số lượng voucher( từ 1 - 100 )</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="component-helper">Giá trị voucher</InputLabel>
                                        <Input
                                            type="number"
                                            required
                                            id="component-helper"
                                            value={price}
                                            onChange={(event) => {
                                                this.setState({ price: event.target.value });
                                            }}
                                            aria-describedby="component-helper-text"
                                            inputProps={{ min: "1000", step: "10000" }}
                                        />
                                        <FormHelperText id="component-helper-text">Nhập giá trị voucher ( từ 1000 đ trở lên )</FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid
                                    style={{ padding: 50 }}
                                    container className={classes.root}
                                    spacing={10} direction="row"
                                    justify="space-between"
                                    alignItems="center"
                                >
                                    <Grid item xs={12} md={2}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <DatePicker
                                                value={fromDate}
                                                label="Từ ngày"
                                                variant="outlined"
                                                style={{ marginTop: 17, width: "110%", marginLeft: -7 }}
                                                onChange={(date) => {
                                                    this.setState({ fromDate: date });
                                                }}
                                                minDate={new Date()}
                                                maxDate={toDate}
                                                leftArrowIcon={<KeyboardArrowLeft />}
                                                rightArrowIcon={<KeyboardArrowRight />}
                                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <TimePicker
                                                margin="normal"
                                                label="Từ giờ"
                                                value={fromDate}
                                                variant="outlined"
                                                minDate={new Date()}
                                                maxDate={toDate}
                                                onChange={(date) => {
                                                    this.setState({ fromDate: date });
                                                }}
                                                labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('HH:mm:ss')}
                                                style={{ marginLeft: -3, marginTop: 17 }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>
                                    
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
                                                labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
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
                                    
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Button onClick={() => this.props.history.push("/admin/voucher")} style={{ marginRight: 20 }} variant="contained" >Hủy bỏ</Button>
                                    <Button variant="contained" color="secondary" onClick={() => this.generateCode()}>Thêm mới</Button>
                                </Grid>


                            </Grid>

                        }
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
    //     overflowY:'hidden'
    // },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(connect(mapStateToProps)(AddVoucher));