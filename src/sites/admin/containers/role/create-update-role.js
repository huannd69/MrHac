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
import { SelectValidator } from 'react-material-ui-form-validator';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from '../../components/confirm/';
import RoleProvider from '../../../../data-access/role-provider';

import { createList, getSicks } from '../../../../utils/apiAxios'

function Transition(props) {

    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateRole extends React.Component {
    constructor(props) {
        super(props)
        let dataEdit = this.props.data
        this.state = {
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
                    name: 'Bệnh nhân xanh'
                }
            }, {
                type: {
                    id: 2,
                    name: 'Bệnh nhân vàng'
                }
            }, {
                type: {
                    id: 3,
                    name: 'Bệnh nhân đỏ'
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
        getSicks(this.props.userApp.currentUser.token).then(res => {
            console.log(res);
            this.setState({
                dataSicks: res.data
            })
        })
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
       if(this.state.dataEdit){
        let name = this.state.nameListQuestion
        let type = this.state.type
        let disease_id = this.state.typeSicks
        let objectType = this.state.TypeObject
        let list_question_id = this.state.dataEdit._id
        let token = this.props.userApp.currentUser.token
        let data = {
            name, type, disease_id, objectType,list_question_id
        }
        console.log(data)
        createList(data, token).then(res => {
            this.handleClose();
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
       }else{
        let name = this.state.nameListQuestion
        let type = this.state.type
        let disease_id = this.state.typeSicks
        let objectType = this.state.TypeObject
        // if (this.validateDataSend() === '') {
        let token = this.props.userApp.currentUser.token
        let data = {
            name, type, disease_id, objectType
        }
        console.log(data)
        createList(data, token).then(res => {
            this.handleClose();
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
       }
        // return
        // const { dataRole, name, code, createPersonId, updatePersonId, } = this.state;
        // let id = dataRole && dataRole.roles ? dataRole.roles.id : '';
        // let param = {
        //     roles: {
        //         name: name.trim(),
        //         code: code.trim()
        //     },
        //     createPersonId,
        //     updatePersonId,
        // }

        // if (dataRole && dataRole.roles && dataRole.roles.id) {
        //     // if (this.validateDataSend() === '') {
        //     RoleProvider.update(id, param).then(s => {
        //         switch (s.code) {
        //             case 0:
        //                 this.handleClose();
        //                 toast.success("Cập nhật " + name + " thành công!", {
        //                     position: toast.POSITION.TOP_RIGHT
        //                 });
        //                 break
        //             case 2:
        //                 toast.error("Mã role đã được sử dụng trong hệ thống. Vui lòng sử dụng Mã role khác!", {
        //                     position: toast.POSITION.TOP_RIGHT
        //                 });
        //                 break;
        //             default:
        //                 toast.error("Cập nhật role không thành công!", {
        //                     position: toast.POSITION.TOP_RIGHT
        //                 });
        //         }
        //     }).catch(e => {
        //         toast.error(e.message, {
        //             position: toast.POSITION.TOP_RIGHT
        //         });
        //     })
        //     // } else {
        //     //     alert(this.validateDataSend())
        //     // }
        // } else {
        //     let name = this.state.nameListQuestion
        //     let type = this.state.type
        //     let disease_id = this.state.nameSick
        //     let objectType = this.state.objectType
        //     // if (this.validateDataSend() === '') {
        //     let token = this.props.userApp.currentUser.token
        //     let data = {
        //         name, type, disease_id, objectType
        //     }
        //     createList(data, token).then(res => {
        //         console.log(res);
        //     }).catch(err => {
        //         console.log(err);
        //     })
        // }
    }

    render() {
        const { classes } = this.props;
        const { dataRole, name, code, stt, total, progress, confirmDialog, deleteable } = this.state;
        console.log(this.state.typeSicks, 'this.state.dataSicks')
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
                            {dataRole.roles && dataRole.roles.id ? 'Cập nhật danh sách câu hỏi ' : 'Tạo mới danh sách câu hỏi'}
                            {dataRole.roles && dataRole.roles.id && deleteable ? <Button style={{ float: "right" }} onClick={() => this.showModalDelete(dataRole)} variant="contained" color="inherit">Xóa</Button> : null}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={this.state.nameListQuestion}
                                        id="name" name="name" label="Tên danh sách câu hỏi"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ nameListQuestion: event.target.value }) }}
                                        margin="normal"

                                    />
                                    <Grid item xs={12} md={6}>
                                        <div style={{ marginBottom: '25px' }}></div>
                                        {
                                            this.state.listType == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Chọn loại câu hỏi</div>
                                        }
                                        <SelectValidator
                                            value={this.state.type}
                                            onChange={(event) => { this.data2.gender = event.target.value; this.setState({ type: event.target.value }); console.log(event, 'âsđâsd') }}
                                            inputProps={{ name: 'selectGender', id: 'selectGender' }}
                                            style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                this.state.listType && this.state.listType.length ? this.state.listType.map((option, index) =>
                                                    <MenuItem key={index} value={option.type.id}>{option.type.name}</MenuItem>
                                                ) : null
                                            }
                                        </SelectValidator>
                                    </Grid>
                                    {/* <TextValidator
                                        value={name}
                                        id="name" name="name" label="Role (*)"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Role không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    /> */}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '25px' }}></div>
                                {
                                    this.state.typeSicks == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Chọn loại bệnh</div>
                                }
                                <SelectValidator
                                    value={this.state.typeSicks}
                                    onChange={(event) => { this.data2.sicks = event.target.value; this.setState({ typeSicks: event.target.value }); console.log(event, 'âsđâsd') }}
                                    inputProps={{ name: 'selectGender', id: 'selectGender' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        this.state.dataSicks && this.state.dataSicks.length ? this.state.dataSicks.map((option, index) =>
                                            <MenuItem key={index} value={option._id}>{option.name}</MenuItem>
                                        ) : null
                                    }
                                </SelectValidator>
                            </Grid>
                            {/* <TextValidator
                                        value={name}
                                        id="name" name="name" label="Role (*)"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Role không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    /> */}

                            {this.state.type == 2 ? <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '25px' }}></div>
                                {
                                    this.state.TypeObject == -1 ? null : <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Chọn loại bệnh nhân</div>
                                }
                                <SelectValidator
                                    value={this.state.TypeObject}
                                    onChange={(event) => { this.data2.sicks = event.target.value; this.setState({ TypeObject: event.target.value }); console.log(event, 'âsđâsd') }}
                                    inputProps={{ name: 'selectGender', id: 'selectGender' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        this.state.objectType && this.state.objectType.length ? this.state.objectType.map((option, index) =>
                                            <MenuItem key={index} value={option.type.id}>{option.type.name}</MenuItem>
                                        ) : null
                                    }
                                </SelectValidator>
                            </Grid> : null}
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
                                    {
                                        this.data != JSON.stringify(this.data2) ?
                                            <Button variant="contained" color="secondary" type="submit">Thêm mới </Button> :
                                            <Button variant="contained" color="secondary" disabled>Thêm mới</Button>
                                    }
                                </DialogActions>
                        }
                    </ValidatorForm>
                </Dialog>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa role này ra khỏi danh sách?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
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
    }, helpBlock: {
        color: 'red',
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateRole));