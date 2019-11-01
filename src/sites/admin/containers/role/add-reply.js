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
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import ConfirmDialog from '../../components/confirm';
import RoleProvider from '../../../../data-access/role-provider';
import { addReply } from '../../../../utils/apiAxios'

function Transition(props) {

    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class AddReply extends React.Component {
    constructor(props) {
        super(props)
        let dataEdit = this.props.data
        this.state = {
            dataEdit,
            open: true,
            dataRole: dataEdit,
            createPersonId: (this.props.userApp.currentUser || {}).id,
            updatePersonId: (this.props.userApp.currentUser || {}).id,
            name: '',
            code: '',
            nameListQuestion: dataEdit ? dataEdit.name : '',
            type: dataEdit ? dataEdit.type : '',
            typeSicks: dataEdit && dataEdit.sicks && dataEdit.sicks.name ? dataEdit.sicks.name : '',
            TypeObject: dataEdit && dataEdit.objectType ? dataEdit.objectType : '',
            confirmDialog: false,
            progress: false,
            tempDelete: {},
            checked: false,
            objectType: [{
                type: {
                    id: 1,
                    name: 'Chọn số'
                }
            }, {
                type: {
                    id: 2,
                    name: 'Trắc nghiệm'
                }
            }, {
                type: {
                    id: 3,
                    name: 'Checkbox'
                }
            }],
            listType: [{
                type: {
                    id: -1,
                    name: '--- Chọn loại hiển thị ---'
                }
            }, {
                type: {
                    id: 1,
                    name: 'Hiển thị lần đầu'
                }
            }, {
                type: {
                    id: 2,
                    name: 'Hiển thị hằng ngày'
                }
            }],
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    handleClose = () => {
        this.props.callbackOff()
    };

    toggleChange = () => {
        this.setState({
            checked: !this.state.checked,
        });
    }

    showModalDelete(item) {
        if (this.state.deleteable) {
            this.setState({ confirmDialog: true, tempDelete: item })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    delete(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            RoleProvider.delete(this.state.tempDelete.roles.id).then(s => {
                if (s && s.data) {
                    toast.success("Xóa role thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({ confirmDialog: false });
                    //   this.props.history.push('/admin/role');
                    this.setState({ tempDelete: {} });
                    this.handleClose();

                }
                else if (s.code == 2) {
                    toast.error("Không xóa được role vì đã có user/staff!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
                else {
                    toast.error("Xóa role không thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        }
    }

    create = () => {
        let name = this.state.nameQuestion
        let from = this.state.from
        console.log('from: ', from);
        let to = this.state.to
        console.log('to: ', to);
        let total = this.state.total
        let question_id = this.state.dataEdit._id
        console.log('this.state.dataEdit: ', this.state.dataEdit);
        if (from < to) {
            toast.error("Bạn nhập sai khung điểm", {
                position: toast.POSITION.TOP_CENTER
            });
            return
        }
        let data = [
            {
                name,
                question_id,
                from,
                to,
                total
            }
        ]
        let token = this.props.userApp.currentUser.token
        addReply(data, token).then(res => {
            console.log(res)
            toast.success("Thêm câu trả lời thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.handleClose();

        })

    }

    render() {
        const { classes } = this.props;
        const { dataRole, name, code, stt, total, progress, confirmDialog, deleteable } = this.state;
        console.log(this.state.dataEdit.type, 'this.state.dataSicks')
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">

                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title">
                            Tạo mới câu hỏi
                            {dataRole.roles && dataRole.roles.id && deleteable ? <Button style={{ float: "right" }} onClick={() => this.showModalDelete(dataRole)} variant="contained" color="inherit">Xóa</Button> : null}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={this.state.nameQuestion}
                                        id="name" name="name" label="Tên câu trả lời"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ nameQuestion: event.target.value }) }}
                                        margin="normal"

                                    />
                                    {this.state.dataEdit.type == 2 && <Grid item xs={12} md={12}> <TextValidator
                                        value={this.state.from}
                                        id="name" name="name" label="Từ điểm"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ from: event.target.value }) }}
                                        margin="normal"

                                    />
                                        <TextValidator
                                            value={this.state.to}
                                            id="name" name="name" label="Đến điểm"
                                            className={classes.textField}
                                            // onChange={(event) => this.setState({ name: event.target.value })}
                                            onChange={(event) => { this.data2.name = event.target.value; this.setState({ to: event.target.value }) }}
                                            margin="normal"

                                        /> </Grid>}
                                    <TextValidator
                                        value={this.state.total}
                                        id="name" name="name" label="Tổng điểm"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ total: event.target.value }) }}
                                        margin="normal"

                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        {/* <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            <Button variant="contained" color="primary" type="submit">Ok</Button>
                        </DialogActions> */}
                        {
                            dataRole.roles && dataRole.roles.id ?
                                <DialogActions>
                                    <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                                    {
                                        this.data != JSON.stringify(this.data2) ?
                                            <Button variant="contained" color="secondary" type="submit">Cập nhật</Button> :
                                            <Button variant="contained" color="secondary" disabled>Cập nhật</Button>
                                    }

                                </DialogActions> :
                                <DialogActions>
                                    <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                                    <Button variant="contained" color="secondary" type="submit">Thêm mới </Button>

                                </DialogActions>
                        }
                    </ValidatorForm>
                </Dialog>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa role này ra khỏi danh sách?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
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

export default withStyles(styles)(connect(mapStateToProps)(AddReply));