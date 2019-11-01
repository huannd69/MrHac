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
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import ConfirmDialog from '../../components/confirm';
import stringUtils from 'mainam-react-native-string-utils';
import RoleProvider from '../../../../data-access/role-provider';
import advertiseProvider from '../../../../data-access/advertise-provider';
import MenuItem from '@material-ui/core/MenuItem';
import imageProvider from '../../../../data-access/image-provider';


function Transition(props) {

    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateAdvertise extends React.Component {
    constructor(props) {
        super(props)
        // let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 1024).length > 0;
        // let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 2048).length > 0;
        // let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 4096).length > 0;
        // let deleteable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 8192).length > 0;

        this.state = {
            open: true,
            permissionIds: [],
            dataRole: this.props.data,
            createPersonId: (this.props.userApp.currentUser || {}).id,
            updatePersonId: (this.props.userApp.currentUser || {}).id,
            name: this.props.data && this.props.data.roles && this.props.data.roles.name ? this.props.data.roles.name : '',
            code: this.props.data && this.props.data.roles && this.props.data.roles.code ? this.props.data.roles.code : '',
            confirmDialog: false,
            progress: false,
            tempDelete: {},
            permission: {
                stt: '',
                total: '',
                page: 0,
                size: 10,
                name: ''
            }, description: '', contents: '', value: '', image: '', title: '',
            checked: false,
            type: 1,
            listType: [{ id: 1, name: 'NOTIFICATION' }, { id: 2, name: 'PROMOTION' }, { id: 4, name: 'NEW_FEATURES' }],
            imageHome: ''
        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }

    componentDidMount() {
        ValidatorForm.addValidationRule('maxLength', (value) => {
            if (value.length > 255)
                return false
            return true
        });
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
    uploadAvatarLogo(event, active) {
        let selector = event.target;
        let fileName = selector.value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
        let sizeImage = event.target.files[0].size / 1048576;
        if (fileName.endsWith(".jpg") ||
            fileName.endsWith(".png")) {
            if (sizeImage > 2) {
                toast.error("Ảnh không vượt quá dung lượng 2MB", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                imageProvider.upload(event.target.files[0]).then(s => {
                    if (s && s.data.code == 0 && s.data.data) {
                        this.setState({
                            imageHome: s.data.data.images[0].image,
                        })
                        console.log(s.data.data.images[0].image, 'áđâsđá')
                        this.data2.imageHome = s.data.data.images[0].image;
                    } else {
                        toast.error("Vui lòng thử lại !", {
                            position: toast.POSITION.TOP_LEFT
                        });
                    }
                    this.setState({ progress: false })
                }).catch(e => {
                    this.setState({ progress: false })
                })
            }

        } else {
            toast.error("Vui lòng chọn hình ảnh có định dạng png, jpg", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    create = () => {
        //api
        let title = this.state.title
        let value = this.state.value
        let description = this.state.description
        let content = this.state.content
        let type = this.state.type
        let images = this.state.imageHome
        let rank = '1'
        let data = {
            'advertise': {
                title, value, description, content, type, images, rank
            }
        }
        advertiseProvider.create(data).then(res => {
            console.log(res);
            toast.success("Tạo mới quảng cáo thành công!", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.handleClose();
        })


    }

    render() {
        const { classes } = this.props;
        const { dataRole, name, code, permission, stt, total, progress, confirmDialog, deleteable } = this.state;
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
                            {'Tạo mới Advertise'}
                            {dataRole.roles && dataRole.roles.id && deleteable ? <Button style={{ float: "right" }} onClick={() => this.showModalDelete(dataRole)} variant="contained" color="inherit">Xóa</Button> : null}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <Grid item xs={12} md={6}>
                                        <div style={{ marginBottom: '25px' }}></div>
                                        <div style={{ position: "absolute", marginTop: -9, fontSize: 13 }}>Loại quảng cáo</div>
                                        <SelectValidator
                                            value={this.state.type}
                                            onChange={(event) => { this.data2.type = event.target.value; this.setState({ type: event.target.value }) }}
                                            style={{ width: '100%', marginTop: 8 }}>
                                            {
                                                this.state.listType && this.state.listType.length ? this.state.listType.map((option, index) =>
                                                    <MenuItem key={index} value={option.id}>{option.name}</MenuItem>
                                                ) : null
                                            }
                                        </SelectValidator>
                                    </Grid>
                                    <TextValidator
                                        value={this.state.title}
                                        id="title" name="title" label="Title (*)"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.title = event.target.value; this.setState({ title: event.target.value }) }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Title không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                    <TextValidator
                                        value={this.state.description}
                                        id="description" name="description" label="Description"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.description = event.target.value; this.setState({ description: event.target.value }) }}
                                        margin="normal"

                                    />
                                    <TextValidator
                                        value={this.state.contents}
                                        id="contents" name="contents" label="Contents"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.contents = event.target.value; this.setState({ contents: event.target.value }) }}
                                        margin="normal"

                                    />
                                    <TextValidator
                                        value={this.state.value}
                                        id="value" name="value" label="Value"
                                        className={classes.textField}
                                        // onChange={(event) => this.setState({ name: event.target.value })}
                                        onChange={(event) => { this.data2.value = event.target.value; this.setState({ value: event.target.value }) }}
                                        margin="normal"

                                    />
                                    <Grid item xs={12} md={6}>
                                        <div>
                                            <span style={{ fontSize: 17, marginRight: 15 }}>Ảnh hiển thị: </span>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                style={{ display: 'none' }}
                                                id="upload_imageHome"
                                                onChange={(event) => { this.data2.imageHome = event.target.files[0].name; this.uploadAvatarLogo(event, 4) }}
                                                type="file"
                                            />
                                            <label htmlFor="upload_imageHome">
                                                <Button component="span">
                                                    <img style={{ width: 30, margin: 'auto', border: "1px soild" }}
                                                        src="/image-icon.png" />
                                                </Button>
                                            </label>
                                            <div style={{ marginBottom: 12 }}>
                                                {
                                                    this.state.imageHome ? <img style={{ marginLeft: '23%', height: 100, border: "1px soild" }}
                                                        src={this.state.imageHome.absoluteUrl()} /> : null
                                                }
                                            </div>
                                            <div style={{ fontSize: 14, fontStyle: 'italic', marginLeft: '23%' }}>Kích thước ảnh tiêu chuẩn: 220x52</div>
                                        </div>
                                    </Grid>
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
                                            <Button variant="contained" color="primary" type="submit">Cập nhật</Button> :
                                            <Button variant="contained" color="primary" disabled>Cập nhật</Button>
                                    }

                                </DialogActions> :
                                <DialogActions>
                                    <Button onClick={this.handleClose} variant="contained" color="inherit">Hủy bỏ</Button>
                                    {
                                        this.data != JSON.stringify(this.data2) ?
                                            <Button variant="contained" color="primary" type="submit">Thêm mới </Button> :
                                            <Button variant="contained" color="primary" disabled>Thêm mới</Button>
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateAdvertise));