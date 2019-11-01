import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import EnhancedTableToolbar from '../../components/table-toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TablePaginationActions from '../../components/pagination/pagination';
import ConfirmDialog from '../../components/confirm/';
import { withStyles } from '@material-ui/core/styles';
import doctorInfProvider from '../../../../data-access/doctorInf-provider';
import roleProvider from '../../../../data-access/role-provider';
import userProvider from '../../../../data-access/user-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import RejectDoctor from './reject-doctorInf';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


class MgrAdmin extends Component {
    constructor(props) {
        super(props);

        let viewable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 128).length > 0;
        let createable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 256).length > 0;
        let updateable = (this.props.userApp.currentUser.permission||{}).filter(item => item.value == 512).length > 0;

        this.state = {
            page: 0,
            size: 20,
            queryString: '',
            specialistId: -1,
            type: 5,
            data: [],
            total: 0,
            active: 0,
            selected: [],
            dataDoctor: {},
            listSpecialist: [],
            tempDelete: {},
            progress: true,
            modalResult: false,
            confirmDialog: false,
            modalReject: false,
            image: [],
            openImage: false,
            viewable,
            createable,
            updateable,
        }
    }

    componentWillMount() {
        this.loadPage();
        this.getSpecialist();
    }

    loadPage() {
        this.setState({ progress: true })
        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            queryString: this.state.queryString.trim(),
            specialistId: this.state.specialistId,
            active: this.state.active,
            type: this.state.type
        }
        doctorInfProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                this.setState({
                    data: s.data.data,
                    // image: s.data.data.doctorInf.image.split(','),
                    stt,
                    total: s.data.total,
                })
            } else {
                this.setState({
                    data: []
                })
            }
            this.setState({ progress: false })
        }).catch(e => {
            this.setState({ progress: false })
        })
    }

    activeDoctor(type) {
        this.setState({ confirmDialog: false }, () => {
            if (type == 1)
                doctorInfProvider.active(this.state.tempDelete.doctorInf.id).then(s => {
                    switch (s.code) {
                        case 0:
                            toast.success("Duyệt bác sĩ " + this.state.tempDelete.doctorInf.name + " thành công!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            this.loadPage();
                            break
                        case 2:
                            toast.error("SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 3:
                            toast.error("Email đã được sử dụng trong hệ thống. Vui lòng sử dụng Email khác!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        case 4:
                            toast.error("Số văn bằng chuyên môn đã tồn tại trên hệ thống. Vui lòng sử dụng Số văn bằng chuyên môn khác!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                            break;
                        default:
                            toast.error("Duyệt bác sĩ không thành công!", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                    }
                })
        })

    }

    getSpecialist() {
        let params = {
            page: 1,
            size: 9999,
        }
        specialistProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let dataTemp = [{
                    specialist: {
                        id: -1,
                        name: 'Tất cả'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listSpecialist: dataTemp,
                })
            }
        }).catch(e => {
        })
    }

    closeModal() {
        this.loadPage();
        this.setState({ modalReject: false });
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.loadPage()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.loadPage()
        });
    };

    modalReject(item) {
        if (this.state.updateable){
            this.setState({
                modalReject: true,
                dataDoctor: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
    }

    modalApproval = (item) => {
        if (this.state.updateable){
            this.setState({
                confirmDialog: true,
                tempDelete: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
    }

    closeImage() {
        this.setState({ modalDetailImage: false });
    }

    listImage(){
        this.state.data.map()
    }

    modalDetailImage(option, index, item) {
        if (this.state.viewable){
            this.setState({
                openImage: true,
                photoIndex: index,
                image: item.doctorInf.image.split(',')
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
              });
        }
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
                    this.loadPage()
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                page: 0,
                specialistId: event.target.value
            }, () => {
                this.loadPage();
            })
        }
    }

    sortName() {
        switch (this.state.type) {
            case 1:
                this.setState({
                    page: 0,
                    type: 3
                }, () => {
                    this.loadPage();
                })
                break;
            case 3:
                this.setState({
                    page: 0,
                    type: 1
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 3
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortEmail() {
        switch (this.state.type) {
            case 2:
                this.setState({
                    page: 0,
                    type: 4
                }, () => {
                    this.loadPage();
                })
                break;
            case 4:
                this.setState({
                    page: 0,
                    type: 2
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 4
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortDate() {
        switch (this.state.type) {
            case 5:
                this.setState({
                    page: 0,
                    type: 6
                }, () => {
                    this.loadPage();
                })
                break;
            case 6:
                this.setState({
                    page: 0,
                    type: 5
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 6
                }, () => {
                    this.loadPage();
                })
        }
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { listRole, roleId, active, listSpecialist, specialistId } = this.state;
        return (
            <div>
                <TextField
                    style={{ marginTop: 8, marginLeft: 0, width: '40%', float: 'left' }}
                    id="outlined-textarea" label="Tìm kiếm" 
                    // multiline
                    placeholder="Họ tên / Email / Số điện thoại"
                    className={classes.textField}
                    value={this.state.queryString}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                    margin="normal" variant="outlined"
                />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel style={{ top: 8, background:'#FFF'  }}
                        ref={ref => {
                            this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-age-simple"
                    >
                        Chuyên khoa
                    </InputLabel>
                    <Select
                        value={specialistId}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="age"
                                id="outlined-age-simple"
                            />
                        }
                        style={{ width: 130, marginTop: 8, height: 55, textAlign: "left" }}>
                        {
                            listSpecialist.map((option, index) =>
                                <MenuItem key={index} value={option.specialist.id}>{option.specialist.name}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { tempDelete, data, page, size, total, progress, stt, dataDoctor, image, photoIndex, openImage, viewable, updateable, createable } = this.state;
        return (
            <div>
                <Paper className={classes.root + ' admin-page doctor-inf-page'}>
                {
                    viewable ?
                    <div className={classes.tableWrapper}>
                        <h2 className="title-page">Quản lý Bác sĩ đăng kí</h2>
                        <EnhancedTableToolbar
                            title=""
                            numSelected={0}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        <div className="table-wrapper">
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell style={{ width: "12%" }}>Họ Tên
                                        <IconButton onClick={() => this.sortName()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                            <SortByAlphaIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{width: '9%'}}>Số điện thoại</TableCell>
                                    <TableCell style={{ width: "15%" }}>Email
                                        <IconButton onClick={() => this.sortEmail()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                            <SortByAlphaIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{ width: "15%" }}>Chuyên khoa</TableCell>
                                    <TableCell style={{ width: "15%" }}>Số văn bằng chuyên môn</TableCell>
                                    <TableCell style={{ width: "12%" }}>Ngày tạo
                                        <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                                            <SortIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell style={{ width: "14%" }}>Đính kèm</TableCell>
                                    <TableCell style={{ width: "10%" }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data && data.length ? data.map((item, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell>{index + stt}</TableCell>
                                                <TableCell>{item.doctorInf.name}</TableCell>
                                                <TableCell>{item.doctorInf.phone}</TableCell>
                                                <TableCell style={{ wordBreak: "break-all" }}>{item.doctorInf.email}</TableCell>
                                                <TableCell>
                                                    {
                                                        item.specialist ? item.specialist.name : null
                                                    }
                                                </TableCell>
                                                <TableCell>{item.doctorInf.certificateCode}</TableCell>
                                                <TableCell>{moment(item.doctorInf.createdDate).format("DD/MM/YYYY")}</TableCell>
                                                {
                                                    item.doctorInf.image ?
                                                        <TableCell>
                                                            {
                                                                item.doctorInf.image.split(',').map((option, index) =>
                                                                    <u onClick={() => this.modalDetailImage(option, index, item)} style={{ marginRight: 10 }}> ảnh {index + 1}</u>
                                                                )

                                                            }
                                                        </TableCell> : <TableCell></TableCell>
                                                }
                                                {
                                                    item.doctorInf.active ?
                                                        <TableCell></TableCell> :
                                                        <TableCell>
                                                            {
                                                                updateable ?
                                                                <IconButton onClick={() => this.modalApproval(item)} color="primary" className={classes.button} aria-label="CheckIcon">
                                                                    <CheckIcon />
                                                                </IconButton> : null
                                                            }
                                                            {
                                                                updateable ? 
                                                                <IconButton onClick={() => this.modalReject(item)} color="primary" className={classes.button} aria-label="CloseIcon">
                                                                    <CloseIcon />
                                                                </IconButton> : null
                                                            }
                                                        </TableCell>
                                                }

                                            </TableRow>
                                        );
                                    }) :
                                        <TableRow>
                                            <TableCell colSpan="5">{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        labelRowsPerPage="Số dòng trên trang"
                                        rowsPerPageOptions={[10, 20, 50, 100]}
                                        count={total}
                                        rowsPerPage={size}
                                        page={page}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                        </div>
                        
                    </div>
                    : "Unauthorized error"}
                </Paper>
                {openImage && (
                    <Lightbox
                        mainSrc={image[photoIndex].absoluteUrl()}
                        nextSrc={image[(photoIndex + 1) % image.length].absoluteUrl()}
                        prevSrc={image[(photoIndex + image.length - 1) % image.length].absoluteUrl()}
                        onCloseRequest={() => this.setState({ openImage: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + image.length - 1) % image.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % image.length,
                            })
                        }
                    />
                )}
                {this.state.confirmDialog && <ConfirmDialog title="Xác nhận" content={"Bạn đang tiến hành duyệt bác sĩ " + tempDelete.doctorInf.name + " vào danh sách bác sĩ trong hệ thống Isofhcare"} btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.activeDoctor.bind(this)} />}
                {this.state.modalReject && <RejectDoctor doctorInf={dataDoctor} callbackOff={this.closeModal.bind(this)} />}
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
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(connect(mapStateToProps)(MgrAdmin));