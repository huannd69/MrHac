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
import IconButton from '@material-ui/core/IconButton';
import { getQuestions,getReply } from '../../../../utils/apiAxios'


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailReply extends React.Component {
    constructor(props) {
        super(props);
        console.log('this.props.data: ', this.props.data);
        this.state = {
            open: true,
            dataReply:[],
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
        getReply(id, token).then(res => {
            console.log('res: ', res);
            this.setState({
                dataReply: res.data
            })
        })
    }
    closeModal2() {
        this.loadPage()
        this.setState({ addQuestions: false, addReply: false });
    }
    showModalAdd = () => {
            this.setState({ addReply: true,})
        
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
    render() {
        const { classes } = this.props;
        const { name, code, createdDate, dataReply, progress, loadPage } = this.state;
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
                    <DialogContent style={{ height: 900 }}>
                        {/* </DialogContent> */}
                        <h2 className="title-page">
                            Câu trả lời
                    </h2>
                        {/* <DialogContent> */}
                        <div className={classes.tableWrapper}>
                            {progress ? <LinearProgress /> : null}
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Câu trả lời</TableCell>
                                        <TableCell>Từ(điểm)</TableCell>
                                        <TableCell>Đến(điểm)</TableCell>
                                        <TableCell>Tổng điểm</TableCell>
                                        <TableCell>Tiện ích</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dataReply && dataReply.length ? dataReply.map((item, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={index}
                                                    tabIndex={-1}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.from_point}</TableCell>
                                                    <TableCell>{item.to_point}</TableCell>
                                                    <TableCell>{item.total_point}</TableCell>
                                                    <TableCell>
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
                    <DialogActions>
                        <Button onClick={() => this.showModalAdd()} variant="contained" color='secondary'>Thêm câu trả lời</Button>
                    </DialogActions>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                    </DialogActions>
                </Dialog>
                {this.state.addReply && <AddReply data={this.props.data} callbackOff={this.closeModal2.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(DetailReply));