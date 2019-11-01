import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import ModalUpdate from './create-update-advertise';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import EnhancedTableToolbar from '../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailAdvertise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            dataRole: this.props.data,
            name: this.props.data && this.props.data.roles ? this.props.data.roles.name : '',
            code: this.props.data && this.props.data.roles ? this.props.data.roles.code : '',
            userCreate: this.props.data && this.props.data.createPerson ? this.props.data.createPerson : '',
            createdDate: this.props.data && this.props.data.roles ? this.props.data.roles.createdDate : '',
            userUpdate: this.props.data && this.props.data.updatePerson ? this.props.data.updatePerson : '',
            updatedDate: this.props.data && this.props.data.roles ? this.props.data.roles.updatedDate : '',
            modalUpdate: false,
            progress: false,
            checked: false,
            stt: 1,
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    modalUpdate(dataRole) {
        this.setState({
            modalUpdate: true,
            dataRole,
        })
    }


    closeModal() {
        this.setState({ modalUpdate: false });
        this.handleClose();
    }

    render() {
        const { classes } = this.props;
        const { dataRole, name, code, userCreate, createdDate, userUpdate, updatedDate, stt, progress, checked, } = this.state;
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
                        <Row style={{ marginLeft: 40, marginBottom: 40 }}>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Mã role:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{code}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="12" md="12">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Role:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{name}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người tạo:</label>

                                    <Link class="col-xs-7 controls" className={classes.controls}
                                        style={{ textDecoration: 'none', color: 'black' }}
                                        to={'/admin/mgr-admin?id=' + userCreate.id}>{userCreate.name}</Link> :
                                        <div class="col-xs-7 controls" className={classes.controls}
                                        style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handleCheckUserAdmin()}>
                                        {userCreate.name}
                                    </div>
                                    {/* <div class="col-xs-7 controls" className={classes.controls}>{userCreate}</div> */}
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Người cập nhật:</label>

                                    <Link class="col-xs-7 controls" className={classes.controls}
                                        style={{ textDecoration: 'none', color: 'black' }}
                                        to={'/admin/mgr-admin?id=' + userUpdate.id}>{userUpdate.name}</Link> :
                                        <div class="col-xs-7 controls" className={classes.controls}
                                        style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handleCheckUserAdmin()}>
                                        {userUpdate.name}
                                    </div>

                                    {/* <div class="col-xs-7 controls" className={classes.controls}>{userUpdate}</div> */}
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày tạo:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{moment(createdDate).format("DD-MM-YYYY")}</div>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                                <div class="row mgbt-xs-0">
                                    <label class="col-xs-5 control-label" className={classes.controlLabel}>Ngày cập nhật:</label>
                                    <div class="col-xs-7 controls" className={classes.controls}>{moment(updatedDate).format("DD-MM-YYYY")}</div>
                                </div>
                            </Col>
                        </Row>

                        <div className={classes.tableWrapper}>
                            {progress ? <LinearProgress /> : null}
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Permission</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                    </DialogActions>
                </Dialog>
                {this.state.modalUpdate && <ModalUpdate data={dataRole} callbackOff={this.closeModal.bind(this)} />}
            </div >
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

export default withStyles(styles)(connect(mapStateToProps)(DetailAdvertise));