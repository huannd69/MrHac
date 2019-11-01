import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddQuestions from './add-questions'
import AddReply from './add-reply'
import DetailReply from './detail-reply'
import IconButton from '@material-ui/core/IconButton';
import { getQuestions } from '../../../../utils/apiAxios'


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailRole extends React.Component {
    constructor(props) {
        super(props);
        console.log('this.props.data: ', this.props.data);
        this.state = {
            open: true,
            dataQuestion: this.props.data.questions,
            name: this.props.data && this.props.data.roles ? this.props.data.roles.name : '',
            code: this.props.data && this.props.data.roles ? this.props.data.roles.code : '',
            userCreate: this.props.data && this.props.data.createPerson ? this.props.data.createPerson : '',
            createdDate: this.props.data && this.props.data.roles ? this.props.data.roles.createdDate : '',
            userUpdate: this.props.data && this.props.data.updatePerson ? this.props.data.updatePerson : '',
            updatedDate: this.props.data && this.props.data.roles ? this.props.data.roles.updatedDate : '',
            modalUpdate: false,
            progress: false,
            checked: false,
            addReply: false,
            detailReply: false,
            stt: 1,
            dataPermission: []

        };
    }

    componentWillMount() {
        this.loadPage()
    }



    handleClose = () => {
        this.props.callbackOff()
    };


    closeModal() {
        this.setState({ modalUpdate: false });
        this.handleClose();
    }
    loadPage = () => {
        let token = this.props.userApp.currentUser.token
        let id = this.props.data._id
        getQuestions(id, token).then(res => {
            console.log('res: ', res);
            this.setState({
                dataQuestion: res.data
            })
        })
    }
    closeModal2() {
        this.loadPage()
        this.setState({ addQuestions: false, addReply: false, detailReply: false });
    }
    showModalAdd = (item) => {
        if (item) {
            this.setState({ addReply: true, questionsData: item })
        } else {
            this.setState({ addQuestions: true, })
        }

    }
    renderObjectType = () => {
        const objectType = this.props.data.objectType
        const { classes } = this.props;
        switch (Number(objectType)) {
            case 1:
                return (
                    <div class="col-xs-7 controls" className={classes.controls}>Bệnh nhân xanh</div>
                )
            case 2:
                return (
                    <div class="col-xs-7 controls" className={classes.controls}>Bệnh nhân vàng</div>
                )
            case 3: return (
                <div class="col-xs-7 controls" className={classes.controls}>Bệnh nhân đỏ</div>
            )
            default:
                return (
                    <div class="col-xs-7 controls" className={classes.controls}></div>
                )
        }
    }
    renderType = () => {
        const { classes } = this.props;
        const type = this.props.data.type
        console.log('type: ', type);
        switch (Number(type)) {
            case 1:
                return (<div class="col-xs-7 controls" className={classes.controls}>Hiển thị lần đầu</div>)
            case 2:
                return (<div class="col-xs-7 controls" className={classes.controls}>Hiển thị hằng ngày</div>)
            default:
                return (<div class="col-xs-7 controls" className={classes.controls}></div>)
        }

    }
    modalDetailAdmin(item) {
        this.setState({ detailReply: true, dataReply: item, })
    }
    showModalDelete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
      }
    
    render() {
        const { classes } = this.props;
        const { progress, dataQuestion } = this.state;
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
                    <DialogTitle className="alert-dialog-slide-title">
                        Quản lý câu hỏi

                    </DialogTitle>
                    <DialogContent style={{ height: 900 }}>
                        <Row style={{ marginLeft: 40, marginBottom: 40 }}>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Tên list câu hỏi:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{this.props.data.name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Bệnh:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{this.props.data.sicks.name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Phân loại:</label>
                                    {this.renderType()}
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Đối tượng:</label>
                                    {this.renderObjectType()}
                                </div>
                            </Col>
                        </Row>
                        {/* </DialogContent> */}
                        <h2 className="title-page">
                            Câu hỏi
                    </h2>
                        {/* <DialogContent> */}
                        <div className={classes.tableWrapper}>
                            {progress ? <LinearProgress /> : null}
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Câu hỏi</TableCell>
                                        <TableCell>Màn hình</TableCell>
                                        <TableCell>Định dạng</TableCell>
                                        <TableCell>Lựa chọn</TableCell>
                                        <TableCell>Tiện ích</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataQuestion && dataQuestion.length ? dataQuestion.map((item, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={index}
                                                    tabIndex={-1}>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>{index + 1}</TableCell>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.name}</TableCell>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.position}</TableCell>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.type}</TableCell>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>{item.name}</TableCell>
                                                    <TableCell onClick={() => this.modalDetailAdmin(item)}>
                                                        {
                                                            <IconButton onClick={() => this.modalCreateUpdate(item, 1)} color="primary" className={classes.button} aria-label="EditIcon">
                                                                <img alt="" src="/images/icon/edit1.png" />
                                                            </IconButton>
                                                        }
                                                        {
                                                            <IconButton onClick={() => this.showModalDelete(item)} color="primary" className={classes.button} aria-label="IconRefresh">
                                                                <img alt="" src="/images/icon/delete.png" />
                                                            </IconButton>
                                                        }

                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })
                                            :
                                            <TableRow>
                                                <TableCell>{'Không có dữ liệu'}</TableCell>
                                            </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                    <TableCell>
                        <DialogActions>
                            <Button onClick={() => this.showModalAdd()} variant="contained" color='secondary'>Thêm câu hỏi</Button>
                        </DialogActions>
                    </TableCell>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                    </DialogActions>
                </Dialog>
                {this.state.addQuestions && <AddQuestions data={this.props.data} callbackOff={this.closeModal2.bind(this)} />}
                {this.state.addReply && <AddReply data={this.state.questionsData} callbackOff={this.closeModal2.bind(this)} />}
                {this.state.detailReply && <DetailReply data={this.state.dataReply} callbackOff={this.closeModal2.bind(this)} />}
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
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailRole));