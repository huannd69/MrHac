
import React, { Component } from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
import TablePaginationActions from '../../components/pagination/pagination';
import Slide from '@material-ui/core/Slide';
import EnhancedTableToolbar from '../../components/table-toolbar';
import walletProvider from '../../../../data-access/wallets-provider';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import dateUtils from 'mainam-react-native-date-utils';
import { Col, Row } from 'reactstrap';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import IconButton from '@material-ui/core/IconButton';
import hospitalProvider from '../../../../data-access/hospital-provider';
import { Link } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Clear from '@material-ui/icons/Clear';
import { connect } from 'react-redux';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Wallets extends React.Component {
    constructor(props) {
        super(props);
        let viewableUser = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 16).length > 0;
        let viewableHospital = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 65536).length > 0;


        this.state = {
            open: true,
            selected: [],
            progress: true,
            dataWallet: [],
            dataHospital: [],
            data: [],
            wallet_id: '',
            id: '',
            from_date: '',
            to_date: '',
            type: '',
            statuses: '',
            order_by: "desc",
            order_field: '',
            offset: '',
            tran_id: '',
            limit: 20,
            walletId: this.props.match.params.id,
            name: '',
            viewableUser,
            viewableHospital,
            checkError: false
        }
    }
    componentWillMount() {
        this.wallet();
        this.transactions();
        this.getDetail();
        // walletProvider.getDetail("13").then(s => { }).catch(e => { });
    }


    handleChangeFilter(event) {
        this.setState({
            page: 0,
            tran_id: event.target.value
        }, () => {
            this.transactions();
        })

    }

    getDetail() {
        hospitalProvider.getDetail(this.state.walletId).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    dataHospital: s.data,
                    name: s.data.hospital.name
                })
                this.modalDetailHospital(s.data);
            }
        }).catch(e => {
        })
    }

    getDetailWallet() {
        hospitalProvider.getDetail(this.state.walletId).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    dataHospital: s.data,
                    name: s.data.hospital.name
                })
                this.modalDetailHospital(s.data);
            }
        }).catch(e => {
        })
    }

    wallet() {
        let id = this.state.walletId;
        walletProvider.wallet(id).then(s => {
            if (s && s.data) {
                this.setState({
                    dataWallet: s.data,
                })
            }
        }).catch(e => {
        })
    }

    transactions() {
        this.setState({
            checkError: false
        })
        let params = {
            from_date: this.state.from_date ? this.state.from_date.format('YYYY-MM-dd') : "",
            to_date: this.state.to_date ? this.state.to_date.format('YYYY-MM-dd') : "",
            type: this.state.type,
            statuses: this.state.statuses,
            order_by: this.state.order_by,
            order_field: this.state.order_field,
            offset: this.state.offset*this.state.limit,
            limit: this.state.limit,
            tran_id: this.state.tran_id,
        }
        let id = this.state.walletId;
        walletProvider.transactions(id, params).then(s => {
            if (s && s.data) {
                this.setState({
                    data: s.data,
                    wallet_id: s.wallet_id,
                    id: s.data.id,
                    total: s.paging.total,
                })
                // this.transactions();
            }
        }).catch(e => {
            if (e.status == 422){
                this.setState({
                    checkError : true
                })
            }
        })
    }

    sortTime() {
        switch (this.state.order_by) {
            case "asc":
                this.setState({
                    order_by: "desc",
                    order_field: "created_at"
                }, () => {
                    this.transactions();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "created_at"
                }, () => {
                    this.transactions();
                })
                break;
            // default:
            //     this.setState({
            //         order_by: "desc",
            //         order_field: "created_at"
            //     }, () => {
            //         this.transactions();
            //     })
        }
    }

    sortType() {
        switch (this.state.order_by) {
            case "asc":
                this.setState({
                    order_by: "desc",
                    order_field: "type"
                }, () => {
                    this.transactions();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "type"
                }, () => {
                    this.transactions();
                })
                break;
            // default:
            //     this.setState({
            //         order_by: "desc",
            //         order_field: "type"
            //     }, () => {
            //         this.transactions();
            //     })
        }
    }

    sortCreatePersion() {
        switch (this.state.order_by) {
            case "asc":
                this.setState({
                    order_by: "desc",
                    order_field: "sender_name"
                }, () => {
                    this.transactions();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "sender_name"
                }, () => {
                    this.transactions();
                })
                break;
            // default:
            //     this.setState({
            //         order_by: "desc",
            //         order_field: "sender_name"
            //     }, () => {
            //         this.transactions();
            //     })
        }
    }

    sortUpdatePersion() {
        switch (this.state.order_by) {
            case "asc":
                this.setState({
                    order_by: "desc",
                    order_field: "receiver_name"
                }, () => {
                    this.transactions();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "receiver_name"
                }, () => {
                    this.transactions();
                })
                break;
            // default:
            //     this.setState({
            //         order_by: "desc",
            //         order_field: "receiver_name"
            //     }, () => {
            //         this.transactions();
            //     })
        }
    }

    handleChangePage = (event, action) => {
        this.setState({
            offset: action
        }, () => {
            this.transactions()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ limit: event.target.value }, () => {
            this.transactions()
        });
    };

    closeFromDate(){
        this.setState({
            from_date: ''
        })
        this.transactions();
    }

    closeToDate(){
        this.setState({
            to_date: '',
        })
        this.transactions();
    }

    handleChangeFilter(event, action) {
        if (action == 1) {
            this.setState({
                offset: 0,
                tran_id: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.transactions();
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                offset: 0,
                from_date: event._d
            }, () => {
                this.transactions();
            })
        }
        if (action == 3) {
            this.setState({
                offset: 0,
                to_date: event._d
            }, () => {
                this.transactions();
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { data, dataWallet, selected, wallet_id, from_date, to_date, tran_id, dataHospital, total, offset, limit, name, viewableUser, viewableHospital, checkError } = this.state;
        return (
            <div style={{ width: "100%" }}>
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        {/* <EnhancedTableToolbar
                            numSelected={selected.length}
                            title="Chi tiết tài khoản Ví của CSYT " 
                        /> */}

                        {/* <DialogContent> */}
                        <Row style={{ fontSize: '1.25rem', fontFamily: "Helvetica", fontWeight: 500, lineHeight: 1.6, letterSpacing: '0.0075em', marginLeft: '2.5%', marginTop: 15, marginBottom: 15 }}>
                            Chi tiết tài khoản Ví của CSYT: {name}
                        </Row>
                        <Row style={{ marginLeft: 8 }}>
                            <Col xs="12" sm="3" md="3">
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <div style={{ position: "absolute", top: -6, marginLeft: "84%"}}>
                                        <IconButton onClick={() => this.closeFromDate()} color="primary" className={classes.button} aria-label="Clear">
                                            <Clear />
                                        </IconButton>
                                    </div>
                                    <DatePicker
                                        value={from_date}
                                        label="Từ ngày"
                                        maxDate={new Date()}
                                        onChange={(date) => { 
                                            this.setState({ from_date: date }) ;
                                            this.handleChangeFilter(date, 2)
                                        }}
                                        // onChange={(date) => this.handleChangeFilter(date, 2)}
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                        style={{ width: '90%' }}
                                        maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                        minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                    />
                                </MuiPickersUtilsProvider>
                            </Col>
                            <Col xs="12" sm="3" md="3">
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <div style={{ position: "absolute", top: -6, marginLeft: "84%"}}>
                                        <IconButton onClick={() => this.closeToDate()} color="primary" className={classes.button} aria-label="Clear">
                                            <Clear />
                                        </IconButton>
                                    </div>
                                    <DatePicker
                                        value={to_date}
                                        label="Đến ngày"
                                        maxDate={new Date()}
                                        minDate={from_date}
                                        // onChange={(date) => { this.setState({ to_date: date }) }}
                                        // onChange={(date) => this.handleChangeFilter(date, 3)}
                                        onChange={(date) => { 
                                            this.setState({ to_date: date }) ;
                                            this.handleChangeFilter(date, 3)
                                        }}
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        labelFunc={date => isNaN(date) ? "Chọn ngày" : moment(date).format('DD-MM-YYYY')}
                                        style={{ width: '90%' }}
                                        maxDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                        minDateMessage="Đến ngày không thể nhỏ hơn Từ ngày"
                                    />
                                </MuiPickersUtilsProvider>
                            </Col>
                            <Col xs="12" sm="3" md="3">
                                <TextField
                                    style={{ width: '80%', marginTop: '-2%' }}
                                    label="Mã giao dịch" multiline
                                    id="outlined-textarea"
                                    placeholder="Mã giao dịch"
                                    className={classes.textField}
                                    value={tran_id}
                                    // onChange={(tran_id) => {
                                    //     this.setState({ tran_id: tran_id.target.value });
                                    //     this.transactions();
                                    // }}
                                    onChange={(event) => this.handleChangeFilter(event, 1)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <div className="search-input-error">{checkError && data && data.length ? "Mã giao dịch sai định dạng !" : null}</div>
                            </Col>
                        </Row>
                        {/* </DialogContent> */}
                        {/* {progress ? <LinearProgress /> : null} */}
                        <DialogContent>
                            {/* <Row style={{ marginLeft: 15, marginTop: 20 }}>
                                <Col xs="12" sm="12" md="12">
                                    <div class="row mgbt-xs-0" style={{ fontSize: 21, fontWeight: 600 }}>
                                        <label class="col-xs-5 control-label" className={classes.controlLabel}>Số dư ví: </label>
                                        {
                                            dataWallet.balance ?
                                                <div class="col-xs-7 controls" className={classes.controls} style={{ marginLeft: 13 }}>{dataWallet.balance.formatPrice()} đ</div>
                                                : <div style={{ marginLeft: 13 }}> 0 đ</div>
                                        }

                                    </div>
                                </Col>
                            </Row> */}
                        </DialogContent>
                        {data && data.length ?
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "9%" }}>Thời gian
                                        <IconButton onClick={() => this.sortTime()} color="primary" className={classes.button} aria-label="UnfoldMore">
                                                <UnfoldMore />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>Mã giao dịch</TableCell>
                                        <TableCell style={{ width: "10%" }}>Loại giao dịch
                                            <IconButton onClick={() => this.sortType()} color="primary" className={classes.button} aria-label="UnfoldMore">
                                                <UnfoldMore />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell style={{ width: "9%" }}>Người gửi
                                            <IconButton onClick={() => this.sortCreatePersion()} color="primary" className={classes.button} aria-label="UnfoldMore">
                                                <UnfoldMore />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>Mã người gửi</TableCell>
                                        <TableCell style={{ width: "10%" }}>Người nhận
                                        <IconButton onClick={() => this.sortUpdatePersion()} color="primary" className={classes.button} aria-label="UnfoldMore">
                                                <UnfoldMore />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>Mã người nhận</TableCell>
                                        <TableCell>Nội dung</TableCell>
                                        <TableCell style={{ width: 155 }}>Số tiền (VND)</TableCell>
                                        <TableCell>Mã tham chiếu</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data ? data.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={item.id}
                                                tabIndex={-1}>
                                                <TableCell>{moment(item.created_at).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                                                <TableCell>
                                                    {item.id}
                                                </TableCell>
                                                <TableCell>
                                                    {item.type}
                                                    {/* {item.type == 'DEPOSIT' ? 'Tiền gửi' :
                                                    item.type == 'WITHDRAW' ? 'Rút tiền' :
                                                        item.type == 'TRANSFER' ? 'Chuyển khoản' :
                                                            item.type == 'REFUND' ? 'Hoàn tiền' :
                                                                item.type == 'CARD_FEE' ? 'Phí thẻ' : null} */}
                                                </TableCell>
                                                <TableCell>{item.sender_name ? item.sender_name : null}</TableCell>
                                                {
                                                    item.sender.isofh_care_id ?
                                                        <TableCell>
                                                            {
                                                                item.sender.type == 'CUSTOMER' ?
                                                                    <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                        to={'/admin/user?id=' + (item && item.sender.isofh_care_id ? item.sender.isofh_care_id : '')}>
                                                                         {item.sender.isofh_care_id}
                                                                    </Link> :
                                                                    <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                        to={'/admin/hospital?id=' + (item && item.sender.isofh_care_id ? item.sender.isofh_care_id : '')}>
                                                                         {item.sender.isofh_care_id}
                                                                    </Link>
                                                            }
                                                        </TableCell> :
                                                        <TableCell></TableCell>
                                                }
                                                <TableCell>
                                                    {item.sender_name ? item.receiver_name : null}
                                                </TableCell>
                                                {
                                                    item.receiver.isofh_care_id ?
                                                        <TableCell>
                                                            {
                                                                item.receiver.type == 'CUSTOMER' ?
                                                                    <div>
                                                                        {
                                                                            viewableUser ?
                                                                                <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                                    to={'/admin/user?id=' + (item && item.receiver.isofh_care_id ? item.receiver.isofh_care_id : '')}>
                                                                                    {item.receiver.isofh_care_id} 
                                                                                </Link>
                                                                                :
                                                                                <div style={{ textDecoration: 'none', color: 'black' }}>
                                                                                    {item.receiver.isofh_care_id}
                                                                                </div>
                                                                        }
                                                                    </div>
                                                                     :
                                                                    <div>
                                                                    {
                                                                        viewableHospital ?
                                                                            <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                                to={'/admin/hospital?id=' + (item && item.receiver.isofh_care_id ? item.receiver.isofh_care_id : '')}>
                                                                                {item.receiver.isofh_care_id}
                                                                            </Link>
                                                                            :
                                                                            <div style={{ textDecoration: 'none', color: 'black' }}>
                                                                                {item.receiver.isofh_care_id}
                                                                            </div>
                                                                    }
                                                                </div>
                                                            }
                                                        </TableCell> :
                                                        <TableCell></TableCell>
                                                }
                                                <TableCell>
                                                    {item.memo}
                                                </TableCell>
                                                <TableCell>
                                                    {wallet_id == item.sender_wallet.id ? "- " : "+ "}  {item.amount.formatPrice()}
                                                </TableCell>
                                                <TableCell>
                                                    {item.ref_id}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) : null}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            labelRowsPerPage="Số dòng trên trang"
                                            rowsPerPageOptions={[20, 50, 100]}
                                            count={total}
                                            rowsPerPage={limit}
                                            page={offset}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActions}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            : <p>{this.state.tran_id ? 'Không có kết quả phù hợp' : 
                                this.state.from_date ? 'Không có kết quả phù hợp' :
                                    this.state.to_date? 'Không có kết quả phù hợp' :'Không có dữ liệu'}</p>}
                    </div>
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
        width: '100%',
        marginTop: theme.spacing.unit * 3,
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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

Wallets.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Wallets));