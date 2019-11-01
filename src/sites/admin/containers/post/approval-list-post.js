import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ConfirmDialog from '../../components/confirm';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import postProvider from '../../../../data-access/post-provider';
import userProvider from '../../../../data-access/user-provider';
import SortIcon from '@material-ui/icons/Sort';
import IconButton from '@material-ui/core/IconButton';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import Input from '@material-ui/core/Input';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class ApprovalListPost extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            data: this.props.data,
            listDoctors: this.props.doctors,
            assigneeId: this.props.doctors[0].user.id,
            confirmDialog: false,
            stt: 1,
            type: '',
            page: 0,
            size: 20,
            status: 1,
            specialistId: this.props.specialistId,
            queryString: '',
            postIds: this.props.postIds,
            nameDoctor: '',
            openListDoctor: false
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    // loadPage() {
    //     let arr = [];
    //     let params = {
    //         page: this.state.page + 1,
    //         size: this.state.size,
    //         status: 1,
    //         specialistId: this.state.specialistId,
    //         type: this.state.type
    //     }
    //     postProvider.search(params).then(s => {
    //         if (s && s.code == 0 && s.data) {
    //             let stt = 1 + (params.page - 1) * params.size;
    //             for ( let i = 0; i < s.data.total; i++){
    //                 for (let j = 0; j < this.props.data.length; j ++){
    //                     if ( s.data.data[i].post.id == this.props.data[j].post.id){
    //                         arr.push(s.data.data[i])
    //                     }
    //                 }
    //             }
    //             this.setState({
    //                 data: arr,
    //                 // data: s.data,
    //                 stt,
    //                 total: s.data.total
    //             })
    //         } else {
    //             this.setState({
    //                 data: []
    //             })
    //         }
    //         this.setState({ progress: false })
    //     }).catch(e => {
    //         this.setState({ progress: false })
    //     })
    // }

    componentWillMount(){
        this.getDoctors();
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isNickname', (value) => {
            var re = /^([a-zA-Z0-9_])*$/g;
            if (!value) {
                return true
            }
            return re.test(value.toLowerCase());
        });
        ValidatorForm.addValidationRule('isPhone', (value) => {
            if (!value) {
                return true
            } else {
                return value.isPhoneNumber();
            }
        });
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 255)
                return false
            return true
        });
        
        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length < 8)
                return false
            return true
        });
        ValidatorForm.addValidationRule('maxPhone', (value) => {
            if (value.length > 20)
                return false
            return true
        });
    }

    handleClose = () => {
        this.setState({
            queryString: '',
            specialistId: ''
        })
        this.props.callbackOff();
    };

    confirmAssign = () => {
        this.setState({ confirmDialog: true })
    }

    sortAuthor() {
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

    sortSpecialist() {
        switch (this.state.type) {
            case 7:
                this.setState({
                    page: 0,
                    type: 8
                }, () => {
                    this.loadPage();
                })
                break;
            case 8:
                this.setState({
                    page: 0,
                    type: 7
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

    getDoctors() {
        let params = {
            page: 1,
            size: 99999,
            style: 7,
            type: 1,
            specialistId: this.state.specialistId,
            queryString: this.state.queryString.trim(),
        }
        userProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    listDoctors: s.data.data
                })
            }
        }).catch(e => {
        })
    }

    assign = (type) => {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            const { data, assigneeId, postIds } = this.state;
            let object = {
                assigneeId, 
                postIds
            }
            let listSuccess = [];
            let listError = [];
                postProvider.approvedList(object).then(s => {
                    if (s && s.code == 0) {
                        toast.success(constants.message.post.approved_success, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                    }
                }).catch(e => {
                    toast.error(constants.message.post.approved_error, {
                        position: toast.POSITION.TOP_RIGHT
                    });
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
              this.getDoctors()
            }, 500)
          })
        }
    }

    checkAssigneeId(item){
        this.data2.assigneeId = item.user.id;
        this.data2.nameDoctor = item.user.name;
        // this.setState({ 
        //     assigneeId: item.user.id,
        //     nameDoctor: item.user.name,
        //     queryString: item.user.name
        // });
        // this.getDoctors();
        this.setState({
            page: 0,
            queryString: item.user.name,
            assigneeId: item.user.id,
            nameDoctor: item.user.name,
        }, () => {
            if (this.clearTimeOutAffterRequest) {
                try {
                    clearTimeout(this.clearTimeOutAffterRequest);

                } catch (error) {

                }
            }
            this.clearTimeOutAffterRequest = setTimeout(() => {
                this.getDoctors();
            }, 500)
        })
    }

    modalListDoctor(){
        this.setState({
            openListDoctor: true
        })
    }

    render() {
        const { classes } = this.props;
        const { data, stt, listDoctors, assigneeId, nameDoctor, openListDoctor } = this.state;

        return (
            <div>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth="lg"
                    maxWidth="lg"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.confirmAssign}>
                        <DialogTitle id="alert-dialog-slide-title">
                            Bạn muốn thực hiện duyệt {data.length} câu hỏi và gán cho bác sỹ. Hãy kiểm tra và Xác nhận.
                        </DialogTitle>
                        <DialogContent>
                            <Paper className={classes.root}>
                                <div className={classes.tableWrapper}>
                                    {data && data.length ?
                                        <Table className={classes.table} aria-labelledby="tableTitle">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>STT</TableCell>
                                                    <TableCell>Tên người hỏi
                                                        {/* <IconButton onClick={() => this.sortAuthor()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                            <SortByAlphaIcon />
                                                        </IconButton> */}
                                                    </TableCell>
                                                    <TableCell>Nội dung câu hỏi</TableCell>
                                                    <TableCell>Chuyên khoa
                                                        {/* <IconButton onClick={() => this.sortSpecialist()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                            <SortByAlphaIcon />
                                                        </IconButton> */}
                                                    </TableCell>
                                                    <TableCell>Thời gian đặt câu hỏi
                                                        {/* <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                                                            <SortIcon />
                                                        </IconButton> */}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data ? data.map((item, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={item.post.id}
                                                            tabIndex={-1}>
                                                            <TableCell>{index + stt}</TableCell>
                                                            <TableCell>
                                                                {/* <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                    to={'/admin/user?id=' + (item && item.author ? item.author.id : '')}>
                                                                    {item && item.author && item.author.name}
                                                                </Link> */}
                                                                {item && item.author && item.author.name}
                                                            </TableCell>
                                                            <TableCell style={{ width: 300 }}>
                                                                <Tooltip title={item.post.content}>
                                                                    <div className={classes.contentClass}>{item.post && item.post.content ? item.post.content : ''}</div>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell>{item.specialist && item.specialist.name ? item.specialist.name : ''}</TableCell>
                                                            <TableCell>
                                                                {item.post.createdDate.toDateObject('-').getPostTime()}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }) : null}
                                            </TableBody>
                                        </Table> : <p>Không có dữ liệu</p>}
                                </div>
                            </Paper>
                        </DialogContent>
                        <Input
                                placeholder="Tên Bác sĩ"
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'Description',
                                   }}
                                style={{ position: "absolute", width: "95%", marginLeft: "2%"}}
                                value={this.state.queryString}
                                onChange={(event) => this.handleChangeFilter(event, 1)}
                                onClick={() => this.modalListDoctor()}
                            />
                        {/* <DialogActions>
                        {
                            openListDoctor ?
                                <DialogContent style={{height: 200, marginTop: 20, position: "relative"}}>
                                    {
                                        listDoctors && listDoctors.length ?
                                        <Table className={classes.table} >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Họ tên</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Chuyên khoa</TableCell>
                                                    <TableCell>Số câu hỏi</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listDoctors ? listDoctors.map((item, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={item.user.id}
                                                            tabIndex={-1}>
                                                           
                                                            <TableCell onClick={() => this.checkAssigneeId(item)}>{item.user.name}</TableCell>
                                                            <TableCell onClick={() => this.checkAssigneeId(item)}>{item.user.email}</TableCell>
                                                            {
                                                                item.specialist ?
                                                                <TableCell onClick={() => this.checkAssigneeId(item)}>{item.specialist.name}</TableCell>
                                                                : <TableCell onClick={() => this.checkAssigneeId(item)}></TableCell>
                                                            }
                                                            {
                                                                item.user.numberWaitingPost ?
                                                                <TableCell onClick={() => this.checkAssigneeId(item)}>{item.user.numberWaitingPost}</TableCell> 
                                                                : <TableCell onClick={() => this.checkAssigneeId(item)}></TableCell>
                                                            }
                                                        </TableRow>
                                                    );
                                                }) : null}
                                            </TableBody>
                                        </Table> 
                                        : <p>{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</p>}
                                
                            </DialogContent> : null}
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            {
                                this.data2.assigneeId ?
                                    <Button variant="contained" color="primary" type="submit" >Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            }
                        </DialogActions> */}
                        
                        {
                            openListDoctor ?
                            <div className="list-doctor">
                              {
                                listDoctors && listDoctors.length ?
                                <DialogContent>
                                    <table style={{ marginTop: 66}}>
                                        <tr>
                                            <th style={{ width: "25%"}}>Họ tên</th>
                                            <th style={{ width: "35%"}}>Email</th>
                                            <th style={{ width: "25%"}}>Chuyên khoa</th>
                                            <th style={{ width: "15%"}}>Số câu hỏi</th>
                                        </tr>
                                        {listDoctors ? listDoctors.map((item, index) => {
                                            return (
                                            <tr hover
                                                key={item.user.id}
                                                tabIndex={-1}>
                                                <td onClick={() => this.checkAssigneeId(item)}>{item.user.name}</td>
                                                <td onClick={() => this.checkAssigneeId(item)}>{item.user.email}</td>
                                                {
                                                    item.specialist ?
                                                    <td onClick={() => this.checkAssigneeId(item)}>{item.specialist.name}</td>
                                                    : <td onClick={() => this.checkAssigneeId(item)}></td>
                                                }
                                                {
                                                    item.user.numberWaitingPost ?
                                                    <td onClick={() => this.checkAssigneeId(item)}>{item.user.numberWaitingPost}</td> 
                                                    : <td onClick={() => this.checkAssigneeId(item)}></td>
                                                }
                                            </tr>
                                            );
                                        }) : null}
                                    </table>
                                    </DialogContent>
                                : <p>{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</p>}
                            </div> : null}
                            {/* </DialogContent> */}
                            <DialogActions style={{ marginTop: "3%"}}>
                                <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                                {
                                    this.data2.assigneeId ?
                                    <Button variant="contained" color="primary" type="submit" >Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                                }
                            </DialogActions>
                    </ValidatorForm>
                </Dialog>
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn đang thực hiện duyệt " + this.data2.length + " câu hỏi và gán cho bác sĩ " + nameDoctor} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.assign.bind(this)} />}
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
    }, avatar: {
        margin: 10,
    }, bigAvatar: {
        width: 60,
        height: 60,
    }, helpBlock: {
        color: 'red',
    }
});

export default withStyles(styles)(connect(mapStateToProps)(ApprovalListPost));