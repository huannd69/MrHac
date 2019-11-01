import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import ConfirmDialog from '../../components/confirm';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import serviceTypeProvider from '../../../../data-access/serviceType-provider';
import ImageProvider from '../../../../data-access/image-provider';
import Checkbox from '@material-ui/core/Checkbox';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateServiceType extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataServiceType: this.props.data,
            name: this.props.data && this.props.data.serviceType ? this.props.data.serviceType.name : '',
            confirmDialog: false,
            status: this.props.data && this.props.data.serviceType && this.props.data.serviceType.status == 1 ? true : false
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
        ValidatorForm.addValidationRule('checkSpace', (value) => {
            if (value.trim() == "")
                return false
            return true
        });
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
      };
    

    create = () => {
        const { dataServiceType, name, status } = this.state;
        let id = dataServiceType && dataServiceType.serviceType ? dataServiceType.serviceType.id : '';
        let param = {
            serviceType: {
                name: name.trim(),
                status: status ? 1 : 0
            },
        }
        if (dataServiceType.serviceType && dataServiceType.serviceType.id) {
            serviceTypeProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Tên loại dịch vụ đã tồn tại trong hệ thống!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 4:
                        toast.error("Đã có bản ghi được gán làm giá trị mặc định!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Cập nhật loại dịch vụ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            serviceTypeProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Tạo mới " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Tên loại dịch vụ đã tồn tại trong hệ thống!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    case 4:
                        toast.error("Đã có bản ghi được gán làm giá trị mặc định!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Tạo mới loại dịch vụ không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { dataServiceType, name } = this.state;

        return (
            <div style={{ backgroundColor: 'red', width: '33%' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth="xs"
                    maxWidth="xs"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.create}>
                        <DialogTitle id="alert-dialog-slide-title">
                            {dataServiceType.serviceType && dataServiceType.serviceType.id ? 'Cập nhật Loại dịch vụ ' : 'Thêm mới Loại dịch vụ'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Tên loại dịch vụ (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'checkSpace', 'maxLength']}
                                        errorMessages={['Tên loại dịch vụ không được bỏ trống!', 'Tên loại dịch vụ không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} style={{ fontSize: 16, marginTop: 9}}>
                                   <div>Giá trị mặc định</div>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Checkbox
                                        checked={this.state.status}
                                        onChange= {(event) => { this.data2.status = event.target.checked; this.setState({ status: event.target.checked })}}
                                        value="status"
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            {
                                this.data != JSON.stringify(this.data2) ?
                                    <Button variant="contained" color="primary" type="submit">Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            }
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
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
        color: 'red'
    }
});

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateServiceType));