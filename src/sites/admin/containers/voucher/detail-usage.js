import React from 'react';
import { connect } from 'react-redux';
// import stringUtils from 'mainam-react-native-string-utils';
import voucherProvider from '../../../../data-access/voucher-provider';

// import { toast } from 'react-toastify';
// import { Col, Row } from 'reactstrap';
import moment from 'moment';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailUsage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            voucherId: this.props.voucherId
        };
        console.log(this.state.listHistory);
    }

    handleClose = () => {
        this.props.callbackOff();
        this.props.handleLoadFilter()
    };

    componentWillMount() {
        this.getHistoryVoucherUsed(this.state.voucherId)
    }

    closeModal() {
        this.handleClose();
    }

    getHistoryVoucherUsed = (id) => {
        voucherProvider.getHistory(id)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    this.setState({
                        listHistory: s.data,
                        voucherUseCount: s.data.length
                    });
                    console.log(this.state.voucherUseCount);
                    console.log(this.state.listHistory);
                } else {
                    this.setState({
                        listHistory: []
                    })
                    console.log(s);
                }

            }).catch(e => {
                console.log(e)
            })
    }

    render() {
        // const { classes } = this.props;
        const { listHistory, voucherUseCount } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="md"
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        {'Số lần đã sử dụng: ' + voucherUseCount}
                    </DialogTitle>
                    <DialogContent>
                        <div className="table-wrapper">
                            <Table aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Tên tài khoản</TableCell>
                                        <TableCell>Số điện thoại</TableCell>
                                        <TableCell>Thời gian sử dụng</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        listHistory && listHistory.length ? listHistory.map((item, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={index}
                                                    tabIndex={-1}>
                                                    <TableCell style={{ wordBreak: "break-all" }}>{index + 1}</TableCell>
                                                    <TableCell style={{ wordBreak: "break-all" }}>{item.user.name}</TableCell>
                                                    <TableCell style={{ wordBreak: "break-all" }}>{item.user.phone}</TableCell>
                                                    <TableCell style={{ wordBreak: "break-all" }}>{moment(item.created).format("HH:mm:ss DD-MM-YYYY")}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                            :
                                            <TableRow>
                                                <TableCell>{this.state.name ? 'Không có kết quả phù hợp' : 'Không có người sử dụng'}</TableCell>
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
                    </DialogContent>

                    <DialogActions>

                    </DialogActions>
                </Dialog>
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
    row: {
        display: 'flex',
        justifyContent: 'center',
    }, textField: {
        width: '100%'
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailUsage));