import React, { Component } from 'react'
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import ReplyIcon from '@material-ui/icons/Reply';
import IconButton from '@material-ui/core/IconButton';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortIcon from '@material-ui/icons/Sort';
import TextField from '@material-ui/core/TextField';
import TablePaginationActions from '../../components/pagination/pagination'
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import DateUtils from 'mainam-react-native-date-utils';
import { Link } from 'react-router-dom';
import EnhancedTableToolbar from '../../components/table-toolbar';
import postProvider from '../../../../data-access/post-provider';
import userProvider from '../../../../data-access/user-provider';
import specialistProvider from '../../../../data-access/specialist-provider';
import ApprovalListPost from './approval-list-post';
import ApprovalPost from './approval-post';
import RejectPost from './reject-post';
import DetailPost from './detail-post';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ReactDOM from 'react-dom';
import roleProvider from '../../../../data-access/role-provider';


class Post extends React.Component {
    constructor(props) {
        super(props);

        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 16384).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 32768).length > 0;
        let viewableDoctor = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 128).length > 0;
        let viewableUser = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 16).length > 0;

        this.state = {
            page: 0,
            size: 20,
            queryString: '',
            status: 1,
            specialistId: -1,
            type: 5,
            data: [],
            total: 0,
            selected: [],
            numSelected: 0,
            dataPost: {},
            listDoctors: [],
            listSpecialist: [],
            progress: true,
            modalApprovalListPost: false,
            listPostChecked: [],
            modalApproval: false,
            modalReject: false,
            modalDetailPost: false,
            arr: [],
            arrSpecialist: [],
            postIds: [],
            viewable,
            updateable,
            viewableUser,
            viewableDoctor
        }
    }

    onSelectAllClick = () => {
        if (!this.state.selectAll) {
            let data = this.state.data.map(x => { if (!x.post.status || x.post.status == 1) x.selected = true; return x });
            this.setState({ data, selectAll: true });
        } else {
            let data = this.state.data.map(x => { if (!x.post.status || x.post.status == 1) x.selected = false; return x });
            this.setState({ data, selectAll: false });
        }
    }

    listItemClicked(event, item) {
        item.selected = !item.selected;
        this.setState({
            data: [...this.state.data]
        })
    }

    loadPage() {
        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            queryString: this.state.queryString.trim(),
            status: this.state.status,
            specialistId: this.state.specialistId,
            type: this.state.type
        }
        postProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                let stt = 1 + (params.page - 1) * params.size;
                this.setState({
                    data: s.data.data,
                    stt,
                    total: s.data.total
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

    // getDoctors() {
    //     let params = {
    //         page: 1,
    //         size: 99999,
    //         active: 1,
    //         type: 1,
    //     }
    //     userProvider.search(params).then(s => {
    //         let dataTemp = [{
    //             user: {
    //                 id: -1,
    //                 name: '--- Chọn bác sĩ ---'
    //             }
    //         }]
    //         for (var i = 0; i < s.data.data.length; i++) {
    //             dataTemp.push(s.data.data[i])
    //         }
    //         if (s && s.code == 0 && s.data) {
    //             this.setState({
    //                 listDoctors: dataTemp
    //             })
    //         }
    //     }).catch(e => {
    //     })
    // }
    getDoctors() {
        let params = {
            page: 1,
            size: 99999,
            style: 7,
            type: 1,
            specialistId: this.state.specialistId,
            queryString: this.state.queryString.trim(),
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

    componentWillMount() {
        this.loadPage();
        this.getDoctors();
        this.getSpecialist();
    }



    modalDetailPost(item) {
        this.setState({ modalDetailPost: true, dataPost: item, })
    }

    callbackDelete(text) {
        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    clearTimeOutAffterRequest = null


    modalApproval(item) {
        if (this.state.updateable) {
            this.setState({
                modalApproval: true,
                dataPost: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    modalReject(item) {
        if (this.state.updateable) {
            this.setState({
                modalReject: true,
                dataPost: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    handlecheckUser() {
        if (this.state.viewableUser) {

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    handlecheckDoctor() {
        if (this.state.viewableDoctor) {

        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    closeModal() {
        this.loadPage();
        this.setState({ modalApproval: false, modalReject: false, modalApprovalListPost: false, modalDetailPost: false });
    }

    getPostChecked() {
        const { data, arr } = this.state;
        let ids = data.filter((item, index, self) => {
            return item.selected && item.specialist
        }).map(item => {
            return item.specialist.id;
        }).filter((item, index, self) => {
            return self.indexOf(item) == index;
        });
        if (ids.length >= 2) {
            return toast.error("Chỉ cho phép duyệt nhiều câu hỏi cùng chuyên khoa. Vui lòng kiểm tra lại!", {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            let listPostChecked = data.filter(t => t.selected === true);
            if (ids.length > 0) {
                let specialistId = ids[0];
                // this.setState({
                //     specialistId: specialistId
                // })
            }
            let postIds = data.filter((item, index) => {
                return item.selected
            }).map(item => {
                return item.post.id;
            })
            this.setState({
                modalApprovalListPost: true,
                listPostChecked,
                postIds
            })
            this.setState({ modalApproval: false, modalReject: false, modalDetailPost: false });
        }
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
                    this.loadPage();
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                page: 0,
                status: event.target.value
            }, () => {
                this.loadPage();
            })
        }
        if (action == 3) {
            this.setState({
                page: 0,
                specialistId: event.target.value
            }, () => {
                this.loadPage();
            })
        }
    }

    sortAuthor() {
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

    sortDoctor() {
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

    sortDate() {
        switch (this.state.type) {
            case 6:
                this.setState({
                    page: 0,
                    type: 5
                }, () => {
                    this.loadPage();
                })
                break;
            case 5:
                this.setState({
                    page: 0,
                    type: 6
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 5
                }, () => {
                    this.loadPage();
                })
        }
    }

    sortSpecialist() {
        switch (this.state.type) {
            case 7:
                this.setState({
                    page: 0,
                    type: 8
                }, () => {
                    this.loadPage();
                })
                break;
            case 8:
                this.setState({
                    page: 0,
                    type: 7
                }, () => {
                    this.loadPage();
                })
                break;
            default:
                this.setState({
                    page: 0,
                    type: 8
                }, () => {
                    this.loadPage();
                })
        }
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { name, status, specialistId, listSpecialist, key, updateable } = this.state;
        return (
            <div>
                <TextField
                    style={{ marginTop: 8, marginLeft: 0, width: '40%', float: 'left' }}
                    label="Tìm kiếm" 
                    // multiline
                    id="outlined-textarea"
                    placeholder="Tên người hỏi/ Tên bác sĩ"
                    className={classes.textField}
                    value={name}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                    margin="normal"
                    variant="outlined"
                />
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel style={{ top: 8, background: '#FFF' }}
                        ref={ref => {
                            this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-age-simple"
                    >
                        Trạng thái
                    </InputLabel>
                    <Select
                        style={{ width: 130, marginTop: 8, height: 55, textAlign: "left", marginRight: 8 }}
                        value={status}
                        onChange={(event) => this.handleChangeFilter(event, 2)}
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth || 0}
                                name="age"
                                id="outlined-age-simple"
                            />
                        }
                    >
                        <MenuItem value={-1}>Tất cả</MenuItem>
                        <MenuItem value={1}>Chưa duyệt</MenuItem>
                        <MenuItem value={2}>Đã duyệt</MenuItem>
                        <MenuItem value={3}>Đã trả lời</MenuItem>
                        <MenuItem value={4}>Không hợp lệ</MenuItem>
                        <MenuItem value={5}>Đã từ chối</MenuItem>
                        {/* <MenuItem value={6}>Đã đánh giá</MenuItem> */}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel style={{ top: 8, background: '#FFF' }}
                        ref={ref => {
                            this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-age-simple"
                    >
                        Chuyên khoa
                    </InputLabel>
                    <Select
                        value={specialistId}
                        onChange={(event) => this.handleChangeFilter(event, 3)}
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
                {updateable && this.state.data.filter(x => { return x.selected }).length > 1 ?
                    <Button className="button-new" style={{ margin: 15, float: "right" }} variant="contained" color="primary"
                        onClick={() => this.getPostChecked()}>Duyệt</Button> :
                    <Button className="button-new btn-disabled" style={{ margin: 15, float: "right" }} variant="contained" color="primary" disabled>Duyệt</Button>}

            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { stt, page, size, selected, progress, data, total, listDoctors, listSpecialist, dataPost, listPostChecked, specialistId, postIds, viewable, viewableDoctor, viewableUser, updateable } = this.state;
        return (
            <div>
                <Paper className={classes.root + ' page-wrapper'}>
                    {
                        viewable ?
                            <div className={classes.tableWrapper}>
                                <h2 className="title-page">Quản lý câu hỏi</h2>
                                <EnhancedTableToolbar
                                    numSelected={selected.length}
                                    title=""
                                    actionsChiren={
                                        this.renderChirenToolbar()
                                    }
                                />
                                {progress ? <LinearProgress /> : null}
                                {/* {data && data.length ? */}
                                <div className="table-wrapper">
                                    <Table className={classes.table} aria-labelledby="tableTitle">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    {
                                                        <Checkbox
                                                            checked={
                                                                this.state.data.filter(x => {
                                                                    return x.selected
                                                                }).length == this.state.data.filter(x => !x.post.status || x.post.status == 1).length
                                                            }
                                                            onChange={this.onSelectAllClick} />
                                                    }
                                                </TableCell>
                                                <TableCell>STT</TableCell>
                                                <TableCell>Tên người hỏi
                                                    <IconButton onClick={() => this.sortAuthor()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                        <SortByAlphaIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>Nội dung câu hỏi</TableCell>
                                                <TableCell>Chuyên khoa
                                                    <IconButton onClick={() => this.sortSpecialist()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                        <SortByAlphaIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>Thời gian đặt câu hỏi
                                                    <IconButton onClick={() => this.sortDate()} color="primary" className={classes.button} aria-label="SortIcon">
                                                        <SortIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>Tên bác sĩ
                                                    <IconButton onClick={() => this.sortDoctor()} color="primary" className={classes.button} aria-label="SortByAlphaIcon">
                                                        <SortByAlphaIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>Trạng thái</TableCell>
                                                <TableCell>Thao tác</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data && data.length ? data.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={item.post.id}
                                                        tabIndex={-1}>
                                                        {item.post.status == 1 ?
                                                            <TableCell padding="checkbox">
                                                                {item.selected ?
                                                                    <Checkbox
                                                                        checked={true}
                                                                        onClick={event => this.listItemClicked(event, item)}
                                                                    /> :
                                                                    <Checkbox
                                                                        checked={false}
                                                                        onClick={event => this.listItemClicked(event, item)}
                                                                    />
                                                                }
                                                            </TableCell>
                                                            : <TableCell></TableCell>
                                                        }
                                                        <TableCell>{index + stt}</TableCell>
                                                        <TableCell>
                                                            {
                                                                viewableUser ?
                                                                    <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                        to={'/admin/user?id=' + (item && item.author ? item.author.id : '')}>
                                                                        {item && item.author && item.author.name}
                                                                    </Link> :
                                                                    <div style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handlecheckUser()}>
                                                                        {item && item.author && item.author.name}
                                                                    </div>
                                                            }
                                                        </TableCell>
                                                        <TableCell style={{ width: 300 }}>
                                                            <Tooltip title={item.post.content}>
                                                                <div className={classes.contentClass} onClick={() => this.modalDetailPost(item)} style={{ wordBreak: 'break-all' }}>{item.post && item.post.content ? item.post.content : ''}</div>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell onClick={() => this.modalDetailPost(item)}>{item.specialist && item.specialist.name ? item.specialist.name : ''}</TableCell>
                                                        <TableCell onClick={() => this.modalDetailPost(item)}>
                                                            {item.post.createdDate.toDateObject('-').getPostTime()}
                                                            {/* {moment(item.post.createdDate).format('DD-MM-YYYY')} */}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                viewableDoctor ?
                                                                    <Link style={{ textDecoration: 'none', color: 'black' }}
                                                                        to={'/admin/doctor?id=' + (item && item.assignee ? item.assignee.id : '')}>
                                                                        {item && item.assignee && item.assignee.name}
                                                                    </Link> :
                                                                    <div style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handlecheckDoctor()}>
                                                                        {item && item.assignee && item.assignee.name}
                                                                    </div>
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.post.status == 1 ? 'Chưa duyệt' :
                                                                item.post.status == 2 ? 'Đã duyệt' :
                                                                    item.post.status == 3 ? 'Đã trả lời' :
                                                                        item.post.status == 4 ? 'Không hợp lệ' :
                                                                            item.post.status == 5 ? 'Đã từ chối' :
                                                                                item.post.status == 6 ? 'Đã trả lời' : ''}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.post.status == 1 && updateable ?
                                                                <div>
                                                                    <IconButton onClick={() => this.modalApproval(item)} color="primary" className={classes.button} aria-label="CheckIcon">
                                                                        <CheckIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => this.modalReject(item)} color="primary" className={classes.button} aria-label="CloseIcon">
                                                                        <CloseIcon />
                                                                    </IconButton>
                                                                </div> : item.post.status == 5 && updateable ?
                                                                    <IconButton onClick={() => this.modalApproval(item)} color="primary" className={classes.button} aria-label="ReplyIcon">
                                                                        <ReplyIcon />
                                                                    </IconButton> : null}

                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }) :
                                                <TableRow>
                                                    <TableCell>{this.state.queryString ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
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
                {this.state.modalApprovalListPost && <ApprovalListPost data={listPostChecked} doctors={listDoctors} specialistId={specialistId} postIds={postIds} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalApproval && <ApprovalPost post={dataPost} doctors={listDoctors} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalReject && <RejectPost post={dataPost} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalDetailPost && <DetailPost post={dataPost} callbackOff={this.closeModal.bind(this)} />}
            </div>
        )
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
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    }, contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

Post.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps)(Post));