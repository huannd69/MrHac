
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
import userProvider from '../../../../data-access/user-provider';
import { Link } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Clear from '@material-ui/icons/Clear';
import { connect } from 'react-redux';
import SetPassword from '../user-components/set-password';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import stringUtils from 'mainam-react-native-string-utils';
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class Wallets extends React.Component {
    constructor(props) {
        super(props);
        // let viewableUser = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 16).length > 0;
        // let viewableHospital = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 65536).length > 0;


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
            offset: 0,
            tran_id: '',
            limit: 20,
            walletId: this.props.match.params.id,
            name: '',
            dataUser: [],
            modalSetPassword: false,
            checkError: false,
            hospitalId: 153,
            // viewableUser,
            // viewableHospital
        }
    }
    componentWillMount() {
        this.getDetail();
        // walletProvider.getDetail("13").then(s => { }).catch(e => { });
        this.wallet();
        this.listHospital();
        this.transactions()
    }


    handleChangeFilter(event) {
        this.setState({
            page: 0,
            tran_id: event.target.value
        }, () => {
            this.transactions();
        })

    }
    modalSetPassword() {
        this.setState({ modalSetPassword: true })
    }

    closeModal() {
        this.setState({ modalSetPassword: false });
    }

    // getDetail() {
    //     hospitalProvider.getDetail(this.state.walletId).then(s => {
    //         if (s && s.code == 0 && s.data) {
    //             this.setState({
    //                 dataHospital: s.data,
    //                 name: s.data.hospital.name
    //             })
    //             this.modalDetailHospital(s.data);
    //         }
    //     }).catch(e => {
    //     })
    // }

    getDetail() {
        // let userId = (this.props.userApp.currentUser || {}).id;
        // userProvider.getDetail(userId).then(data => {
        //     if (data && data.code == 0 && data.data) {
        //         this.setState({
        //             dataUser: data.data
        //         });
        //         this.wallet();
        //         this.transactions();
        //     }
        // }).catch(error => {
        // });
    }

    wallet() {
        // let id = this.state.dataUser.hospitalByAdmin.id;
        walletProvider.wallet(this.state.hospitalId).then(s => {
            if (s && s.data) {
                this.setState({
                    dataWallet: s.data,
                })
                console.log(s);
            }
            else {
                console.log(s);
            }
        }).catch(e => {
            console.log(e);
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
            offset: this.state.offset * this.state.limit,
            limit: this.state.limit,
            tran_id: this.state.tran_id,
        }
        // let id = this.state.dataUser.hospitalByAdmin.id;
        walletProvider.getDetail(params).then(s => {
            if (s && s.data) {
                this.setState({
                    data: s.data,
                    wallet_id: s.wallet_id,
                    id: s.data.id,
                    total: s.paging.total,
                })
                // this.transactions();
                console.log(s);
            }
        }).catch(e => {
            if (e.status == 422) {
                this.setState({
                    checkError: true
                })
                toast.error("Unauthorized error!", {
                    position: toast.POSITION.TOP_RIGHT
                });

            }
            console.log(e);
        })
    }

    sortTime() {
        switch (this.state.order_by) {
            case "asc":
                this.setState({
                    order_by: "desc",
                    order_field: "created_at"
                }, () => {
                    this.getDetail();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "created_at"
                }, () => {
                    this.getDetail();
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
                    this.getDetail();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "type"
                }, () => {
                    this.getDetail();
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
                    this.getDetail();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "sender_name"
                }, () => {
                    this.getDetail();
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
                    this.getDetail();
                })
                break;
            case "desc":
                this.setState({
                    order_by: "asc",
                    order_field: "receiver_name"
                }, () => {
                    this.getDetail();
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
            this.getDetail()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ limit: event.target.value }, () => {
            this.getDetail();
        });
    };

    closeFromDate() {
        this.setState({
            from_date: ''
        });
        this.getDetail();
    }

    closeToDate() {
        this.setState({
            to_date: '',
        });
        this.getDetail();
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
                    this.getDetail();
                }, 500)
            })
        }
        if (event.key === "Enter" && action == 5) { 
            this.setState({
                offset: 0,
                tran_id: ''
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.getDetail();
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                offset: 0,
                from_date: event._d
            }, () => {
                this.getDetail();
            })
        }
        if (action == 3) {
            this.setState({
                offset: 0,
                to_date: event._d
            }, () => {
                this.getDetail();
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
            if (s && s.code == 0 && s.data) {
                // let dataTemp = [{
                //     hospital: {
                //         id: 0,
                //         name: 'Tất cả'
                //     }
                // }]
                // for (var i = 0; i < s.data.data.length; i++) {
                //     dataTemp.push(s.data.data[i])
                // }
                this.setState({
                    listHospital: s.data.data,
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

    getOrder(item) {
        let order = item.payment_order;
        if (!order)
            order = item.deposit_order;
        if (!order)
            return {};
        return order;
    }

    render() {
        const { classes } = this.props;
        const { data, dataWallet, dataUser, wallet_id, from_date, to_date, tran_id, dataHospital, total, offset, limit, name, viewableUser, viewableHospital, checkError, listHospital, hospitalId } = this.state;
        return (
            <div style={{ width: "100%" }}>
                <Paper className={classes.root + ' page-wrapper'}>
                    {/* s */}
                    <div className="wallet-list">
                        <h4 className="title-hospital semi-bold">
                            Danh sách giao dịch
                        </h4>
                        <Row >
                            
                            <Col xs="12" sm="4" md="4">
                                <TextField
                                    label="Tìm theo mã giao dịch"
                                    // multiline
                                    id="outlined-textarea"
                                    placeholder="Tìm theo mã giao dịch"
                                    className={classes.textField + ' search-input'}
                                    value={tran_id}
                                    // onChange={(tran_id) => {
                                    //     this.setState({ tran_id: tran_id.target.value });
                                    //     this.transactions();
                                    // }}
                                    onChange={(event) => this.handleChangeFilter(event, 1)}
                                    onKeyPress={(event) => this.handleChangeFilter(event, 5)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <div className="search-input-error">{checkError && data && data.length ? "Mã giao dịch sai định dạng !" : null}</div>
                            </Col>
                            
                        </Row>
                    </div>

                    {/* </DialogContent> */}
                    {/* {progress ? <LinearProgress /> : null} */}
                    {/* <DialogContent> */}
                    <Row style={{ marginLeft: 15, marginTop: 20 }}>
                        <Col xs="12" sm="12" md="12">
                            <div class="row mgbt-xs-0" style={{ fontSize: 21, fontWeight: 600 }}>

                            </div>
                        </Col>
                    </Row>
                    {/* </DialogContent> */}
                    <div className={classes.tableWrapper}>
                        {/* <EnhancedTableToolbar
                            numSelected={selected.length}
                            title="Chi tiết tài khoản Ví của CSYT " 
                        /> */}

                        {/* <DialogContent> */}

                        {/* {data && data.length ? */}
                        <Table className={classes.table + ' table-wallet '} aria-labelledby="tableTitle">
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
                                    <TableCell style={{ width: '10%' }}>Mã người gửi</TableCell>
                                    <TableCell style={{ width: "10%" }}>Người nhận
                                        <IconButton onClick={() => this.sortUpdatePersion()} color="primary" className={classes.button} aria-label="UnfoldMore">
                                            <UnfoldMore />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }}>Mã người nhận</TableCell>

                                    <TableCell>Số tiền (VND)</TableCell>
                                    <TableCell>Nội dung</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Voucher</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.length ? data.map((item, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={item.id}
                                            tabIndex={-1}>
                                            <TableCell ><span className="text-bold">{moment(this.getOrder(item).created_at).format('DD/MM/YYYY')}</span> <br /> {moment(this.getOrder(item).created_at).format('HH:mm:ss')}</TableCell>
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
                                            <TableCell>{((order) => {
                                                if (order.customer)
                                                    return order.customer.full_name
                                            })(this.getOrder(item))}</TableCell>
                                            <TableCell>{((order) => {
                                                if (order.customer)
                                                    return order.customer.isofh_care_id
                                            })(this.getOrder(item))}</TableCell>
                                            <TableCell>{((order) => {
                                                if (order.partner)
                                                    return order.partner.name
                                            })(this.getOrder(item))}</TableCell>
                                            <TableCell>{((order) => {
                                                if (order.partner)
                                                    return order.partner.isofh_care_id
                                            })(this.getOrder(item))}</TableCell>
                                            <TableCell>{((order) => {
                                                if (order.amount)
                                                    return order.amount.formatPrice()
                                            })(this.getOrder(item))}</TableCell>
                                            <TableCell>
                                                {item.memo}
                                            </TableCell>
                                            <TableCell>
                                                {item.status}
                                            </TableCell>
                                            <TableCell>
                                                {item.voucher ? (item.voucher.code +" - "+item.voucher.amount.formatPrice()+"đ") : ""}
                                            </TableCell>

                                        </TableRow>
                                    );
                                }) :
                                    <TableRow>
                                        <TableCell colSpan="10">
                                            {
                                                this.state.tran_id ? 'Không có kết quả phù hợp' :
                                                    this.state.from_date ? 'Không có kết quả phù hợp' :
                                                        this.state.to_date ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'
                                            }
                                        </TableCell>
                                    </TableRow>
                                }
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
                    </div>
                </Paper>
                {this.state.modalSetPassword && <SetPassword data={dataUser} callbackOff={this.closeModal.bind(this)} />}
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