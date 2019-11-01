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
import specialistProvider from '../../../../data-access/specialist-provider';
import ImageProvider from '../../../../data-access/image-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateSpecialist extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataSpecialist: this.props.data,
            name: this.props.data && this.props.data.specialist && this.props.data.specialist.name ? this.props.data.specialist.name : '',
            linkImages: this.props.data && this.props.data.specialist && this.props.data.specialist.linkImages ? this.props.data.specialist.linkImages : '',
            confirmDialog: false,
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
        ValidatorForm.addValidationRule('validLink', (value) => {
            var regexUrl = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
           
            if(!regexUrl.test(value))
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

    create = () => {
        const { dataSpecialist, name, linkImages } = this.state;
        let id = dataSpecialist && dataSpecialist.specialist ? dataSpecialist.specialist.id : '';
        let param = {
            specialist: {
                name: name.trim(),
                linkImages: linkImages
            },
        }
        if (dataSpecialist && dataSpecialist.specialist && dataSpecialist.specialist.id) {
            specialistProvider.update(id, param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Cập nhật " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Tên chuyên khoa đã tồn tại trong hệ thống!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Cập nhật chuyên khoa không thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                }
            }).catch(e => {
                toast.error(e.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
        } else {
            specialistProvider.create(param).then(s => {
                switch (s.code) {
                    case 0:
                        toast.success("Tạo mới " + name + " thành công!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.handleClose();
                        break
                    case 2:
                        toast.error("Tên chuyên khoa đã tồn tại trong hệ thống!", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        break;
                    default:
                        toast.error("Tạo mới chuyên khoa không thành công!", {
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
        const { dataSpecialist, name, linkImages} = this.state;

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
                            {dataSpecialist.specialist && dataSpecialist.specialist.id ? 'Cập nhật Chuyên khoa ' : 'Thêm mới Chuyên khoa'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                {/* { dataSpecialist.specialist && dataSpecialist.specialist.id ? */}
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Tên chuyên khoa (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'checkSpace', 'maxLength']}
                                        errorMessages={['Tên chuyên khoa không được bỏ trống!', 'Tên chuyên khoa không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    /> 
                                    {/* :
                                    <TextValidator
                                        value={name}
                                        id="name" name="name" label="Tên chuyên khoa (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.name = event.target.value; this.setState({ name: event.target.value }); }}
                                        margin="normal"
                                        validators={['required', 'maxLength']}
                                        errorMessages={['Tên chuyên khoa không được bỏ trống!', 'Không cho phép nhập quá 255 kí tự!']}
                                    />
                                } */}
                                </Grid>
                                <Grid item xs={12} md={12}>
                                {/* { dataSpecialist.specialist && dataSpecialist.specialist.id ? */}
                                    <TextValidator
                                        value={linkImages}
                                        id="linkImages" name="linkImages" label="Link icon (*)"
                                        className={classes.textField}
                                        onChange={(event) => { this.data2.linkImages = event.target.value; 
                                        
                                        this.setState({ linkImages: event.target.value });
                                        }}
                                        margin="normal"
                                        validators={['required', 'validLink']}
                                        errorMessages={['Link ảnh không được bỏ trống!', 'Link ảnh không hợp lệ']}
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

export default withStyles(styles)(connect(mapStateToProps)(CreateUpdateSpecialist));