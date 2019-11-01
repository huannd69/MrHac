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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../../../../resources/strings';
import ConfirmDialog from '../../components/confirm/';
import postProvider from '../../../../data-access/post-provider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import userProvider from '../../../../data-access/user-provider';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ApprovalPost extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            open: true,
            dataPost: this.props.post,
            listDoctors: [],
            assigneeId: ((this.props.doctors[0]||{}).user||{}).id,
            nameDoctor: '',
            departmentId: '',
            confirmDialog: false,
            openListDoctor: false,
            queryString: '',
            specialistId: ''
        };
        this.data = JSON.stringify(this.props.post);
        this.data2 = this.props.post;
    }

    componentWillMount(){
        this.getDoctors();
    }

    componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('minPassword', (value) => {
            if (value.length < 8)
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

    getDoctors() {
        let params = {
            page: 1,
            size: 99999,
            style: 7,
            type: 1,
            specialistId: this.state.specialistId,
            queryString: this.state.queryString,
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

    assign = (type) => {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            const { dataPost, assigneeId } = this.state;
            let object = {
                assigneeId: assigneeId
            }
            postProvider.assign(dataPost.post.id, object).then(s => {
                if (s && s.code == 0) {
                    toast.success(constants.message.post.approved_success, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.handleClose();
                }
            }).catch(e => {
                toast.success(constants.message.post.approved_success, {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { dataPost, listDoctors, assigneeId, openListDoctor, nameDoctor } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    fullWidth="lg"
                    maxWidth="lg"
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <ValidatorForm onSubmit={this.confirmAssign}>
                        <DialogTitle id="alert-dialog-slide-title" style={{ marginBottom: 38}}>
                            {dataPost.post.status == 1 ? 'Duyệt câu hỏi ' : dataPost.post.status == 5 ? 'Gán bác sĩ' : ''}
                        </DialogTitle>
                        <Input
                            placeholder=" Tên Bác sĩ"
                            className={classes.input}
                            inputProps={{
                                'aria-label': 'Description',
                               }}
                            style={{ position: "absolute", width: "96%", marginLeft: "2%", marginTop: "-4%"}}
                            value={this.state.queryString}
                            onChange={(event) => this.handleChangeFilter(event, 1)}
                            onClick={() => this.modalListDoctor()}
                        />
                        
                            {/* <Grid container spacing={16}>
                                <Grid item xs={12} md={12}>
                                    <div style={{ marginBottom: '25px' }}></div> */}
                                    {/* <Select
                                        value={assigneeId}
                                        onChange={(event) => {
                                            this.data2.assigneeId = event.target.value;
                                            this.data2.doctor = listDoctors.find(item => item.user.id === event.target.value)
                                            this.setState({ assigneeId: event.target.value })
                                        }}
                                        inputProps={{ name: 'selectAssigneeId', id: 'selectAssigneeId' }}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listDoctors.map((option, index) =>
                                                <MenuItem key={index} value={option.user.id}>{option.user.name}</MenuItem>
                                            )
                                        }
                                    </Select> */}

                                {/* </Grid>
                            </Grid> */}
                        {
                            openListDoctor ?
                            <div className="list-doctor">
                                <DialogContent >
                                {
                                listDoctors && listDoctors.length ?
                                    <table >
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
                                : <p>{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</p>}
                                </DialogContent>
                            </div> : null
                        }
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
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn đang thực hiện duyệt 1 câu hỏi và gán cho bác sĩ " + nameDoctor} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.assign.bind(this)} />}
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
    },
});

export default withStyles(styles)(connect(mapStateToProps)(ApprovalPost));