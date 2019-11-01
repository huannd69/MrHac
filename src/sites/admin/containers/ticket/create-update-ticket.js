import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from '../../components/confirm';
import constants from '../../../../resources/strings';
import stringUtils from 'mainam-react-native-string-utils';
import userProvider from '../../../../data-access/user-provider';
import SetPassword from '../user-components/set-password';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import hospitalProvider from '../../../../data-access/hospital-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

var md5 = require('md5');
class CreateUpdateTicket extends React.Component {
    constructor(props) {
        super(props)
        var fromTime = new Date()
        // fromTime = fromTime.setHours(this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[0].split(':')[0] : '')
        // fromTime = fromTime.setMinutes(this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[0].split(':')[1] : '')
        var toTime = new Date()
        // toTime = toTime.setHours(this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[1].split(':')[0] : '')
        // toTime = toTime.setMinutes(this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[1].split(':')[1] : '')
        this.state = {
            open: true,
            name: ['Thứ hai'],
            confirmDialog: false,
            modalSetPassword: false,
            fromTime: fromTime,
            fromDate: this.props.data && this.props.data.hospital.expired ? moment(this.props.data.hospital.expired) : '',
            toTime: toTime,
            number: this.props.data && this.props.data.hospital.numTurn ? this.props.data.hospital.numTurn : '',
            status: [],

        };
        this.data = JSON.stringify(this.props.data);
        this.data2 = this.props.data;
    }
    componentWillMount() {
        let fromTime = new Date()
        let hourFrom = this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[0].split(':')[0] : null
        let minutesFrom = this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[0].split(':')[1] : null
        fromTime.setHours(hourFrom)
        fromTime.setMinutes(minutesFrom)
        let toTime = new Date()
        let hourTo = this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[1].split(':')[0] : null
        let minutesTo = this.props.data && this.props.data.hospital.timeCombin ? this.props.data.hospital.timeCombin.split('-')[1].split(':')[1] : null
        toTime.setHours(hourTo)
        toTime.setMinutes(minutesTo)
        if ((hourFrom || hourFrom == 0) && (hourTo || hourTo == 0) && (minutesTo || minutesTo == 0) && (minutesFrom || minutesFrom == 0)) {
            this.setState({
                fromTime: fromTime,
                toTime: toTime
            })
        }
    }
    onNumberChanger = (event) => {
        this.setState({ number: event.target.value })
    }
    handleClose = () => {
        this.props.callbackOff()
    };
    onSetTicket = () => {
        let id = this.data2.hospital.id
        let numTurn = this.state.number
        let expired = this.state.fromDate ? moment(this.state.fromDate).format('YYYY-MM-DD HH:mm:ss') : ''
        let hourBegin = this.state.fromTime ? moment(this.state.fromTime).format('HH:mm') : ''
        let hourEnd = this.state.toTime ? moment(this.state.toTime).format('HH:mm') : ''
        let dailyCombin = this.state.status;
        hospitalProvider.setTicket(id, hourBegin, hourEnd, dailyCombin, expired, numTurn).then(res => {
            if (res.data.status == 1) {
                this.handleClose()
            }
        })
    }
    handleChange = (event) => {
        let status = []
        this.setState({
            name: event.target.value
        })

        for (let i = 0; i < event.target.value.length; i++) {
            if (event.target.value[i] == "Thứ hai") {
                status.push('2')
            }
            else if (event.target.value[i].toString() == "Thứ ba") {
                status.push('3');
            }
            else if (event.target.value[i].toString() == "Thứ tư") {
                status.push('4');
            }
            else if (event.target.value[i].toString() == "Thứ năm") {
                status.push('5');
            }
            else if (event.target.value[i].toString() == "Thứ sáu") {
                status.push('6');
            }
            else if (event.target.value[i].toString() == "Thứ bảy") {
                status.push('7');
            }
            else if (event.target.value[i].toString() == "Chủ nhật") {
                status.push('8');
            }
        }
        this.setState({
            status: status,
        });
    }

    closeModal() {
        this.setState({ modalSetPassword: false });
    }

    render() {
        const { classes } = this.props;
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
                            {this.props.data && this.props.data.hospital.hourBegin ? 'Cập nhật giờ lấy số ' : 'Thiết lập giờ lấy số'}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={16}>
                                <Grid item xs={12} md={6}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <TimePicker
                                            margin="normal"
                                            label="Từ giờ"
                                            value={this.state.fromTime}
                                            variant="outlined"
                                            maxDate={this.state.toTime}
                                            onChange={(date) => {
                                                this.setState({ fromTime: date });
                                            }}
                                            labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                                            style={{ width: '45%' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <TimePicker
                                            margin="normal"
                                            label="Đến giờ"
                                            value={this.state.toTime}
                                            minDate={this.state.fromTime}
                                            variant="outlined"
                                            onChange={(date) => {
                                                this.setState({ toTime: date });
                                            }}
                                            labelFunc={date => isNaN(date) ? "Chọn giờ" : moment(date).format('LT')}
                                            style={{ marginLeft: 5, width: '45%' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid style={{ marginTop: 12 }} item xs={12} md={6}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <DatePicker
                                            value={this.state.fromDate}
                                            variant="outlined"
                                            minDate={new Date()}
                                            onChange={date => {
                                                this.setState({ fromDate: date });
                                            }}
                                            label="Áp dụng đến"
                                            leftArrowIcon={<KeyboardArrowLeft />}
                                            rightArrowIcon={<KeyboardArrowRight />}
                                            labelFunc={date =>
                                                isNaN(date)
                                                    ? "Chọn ngày"
                                                    : moment(date).format("DD-MM-YYYY")
                                            }
                                        />
                                    </MuiPickersUtilsProvider>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="outlined-textarea"
                                        placeholder="Tổng lượt lấy số"
                                        multiline
                                        label="Tổng lượt lấy số"
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        value={this.state.number}
                                        onChange={event => this.onNumberChanger(event)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} style={{ marginLeft: "0.5%" }}>
                                    <InputLabel htmlFor="select-multiple-chip">Chọn ngày</InputLabel>
                                    <FormControl className={classes.formControl}>
                                        <Select
                                            multiple
                                            value={this.state.name}
                                            onChange={event => this.handleChange(event)}
                                            input={<Input value="select-multiple-chip" />}
                                            variant="outlined"
                                            renderValue={selected => (
                                                <div className={classes.chips}>
                                                    {selected.map(value => (
                                                        <Chip key={value} label={value} className={classes.chip} />
                                                    ))}

                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {listDay.map(name => (
                                                <MenuItem key={name.name} style={getStyles(name.name, this)} value={name.name}>
                                                    {name.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>



                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                            <Button onClick={this.onSetTicket} variant="contained" color="primary" type="submit">Ok</Button> :
                            {/* {
                                this.data != JSON.stringify(this.data2) ?
                                    <Button onClick={this.onSetTicket} variant="contained" color="primary" type="submit">Ok</Button> :
                                    <Button variant="contained" color="primary" disabled>Ok</Button>
                            } */}
                        </DialogActions>
                    </ValidatorForm>
                </Dialog>
            </div>
        );
    }
}
const listDay = [
    {
        name: 'Thứ hai',
        value: 2
    },
    {
        name: 'Thứ ba',
        value: 3
    },
    {
        name: 'Thứ tư',
        value: 4
    },
    {
        name: 'Thứ năm',
        value: 5
    },
    {
        name: 'Thứ sáu',
        value: 6
    },
    {
        name: 'Thứ bảy',
        value: 7
    },
    {
        name: 'Chủ nhật',
        value: 8
    },
];
function getStyles(name, that) {
    return {
        fontWeight:
            that.state.name.indexOf(name) === -1
                ? that.props.theme.typography.fontWeightRegular
                : that.props.theme.typography.fontWeightMedium,
    };
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 100,
        },
    },
};
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
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    }, avatar: {
        margin: 10,
    }, bigAvatar: {
        width: 60,
        height: 60,
    }, helpBlock: {
        color: 'red',
    }
});
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(CreateUpdateTicket));
