import React, { Component } from 'react';
import voucherProvider from '../../../../data-access/voucher-provider';
// import stringUtils from 'mainam-react-native-string-utils';

import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
// import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
// import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import EnhancedTableToolbar from '../../components/table-toolbar';
import AddIcon from '@material-ui/icons/Add';

class ReadFile extends Component {

    constructor(props) {
        super(props);
        // console.log(this.props.userApp.currentUser.permission);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value === 3).length > 0;
        this.state = {
            dataPhone: [],
            data: [],
            voucherName: '',
            progress: false,
            dataList: [],
            viewable
        }
    }
    componentWillMount() {
        // this.loadPage();
        this.search();

    }
    search = () => {
        let param = {
            type: 1,
            status: 0
        }
        voucherProvider.search(param)
            .then(s => {
                if (s && s.code === 0 && s.data) {
                    this.setState({
                        data: s.data,
                        // }, () => {
                        //     this.loadPage()
                    });
                    console.log(s.data);
                } else {
                    this.setState({
                        data: []
                    })
                }

            }).catch(e => {
                console.log(e)
            })
    }

    handleAddUser = () => {
        const singlePhone = this.state.singlePhone && this.state.singlePhone.isPhoneNumber() ? [this.state.singlePhone] : null
        const phonedt = this.state.dataPhone.length >0 ? this.state.dataPhone : singlePhone;
        const voucherdt = this.state.voucherId ? this.state.voucherId : null;
        
        
        if (phonedt && voucherdt) {
            var obj =
            {
                "phones": phonedt,
                "voucher": {
                    "id": voucherdt
                }
            }
        }
        else {
            obj = null
        }
        
        voucherProvider.importUser(obj)
            .then(s => {
                if (s && s.code === 0 && s.data && obj) {
                    console.log(s);
                    toast.success("Thêm " + phonedt.length + " người dùng thành công", {
                        position: toast.POSITION.TOP_LEFT
                    });
                    this.setState({
                        dataList: []
                    });
                    this.props.history.push("/admin/voucher");
                } else {
                    console.log(s);
                    toast.error("Xin thử lại", {
                        position: toast.POSITION.TOP_LEFT
                    });
                }

            }).catch(e => {
                console.log(e)
            })
    }

    handleImportFile = (e) => {
        var files = e.target.files[0];
        console.log(files);
        if (files !== undefined && (files.name.includes('.xls') || files.name.includes('.xlsx'))) {
            var reader = new FileReader();
            reader.onload = (e) => {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                var sheet_name_list = workbook.SheetNames;
                /* DO SOMETHING WITH workbook HERE */
                var phoneData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list])
                let phoneObj = phoneData.map(
                    item => item.SDT.replace(/[^\d]/g, '')
                    
                );
                    
                this.setState({
                    dataPhone: phoneObj,
                    dataList: phoneData
                })
                

            };
            reader.readAsArrayBuffer(files);

        } else {
            console.log('Error');
        }

        document.getElementById('excel-file').value = '';
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const {
            // dataPhone,
            data,
            voucherId,
            dataList,
            singlePhone

        } = this.state;
        return (
            <div className="tool-bar-booking">
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} md={12} style={{marginLeft: 50}}>
                        <div className="input-choose-excel-file">
                            <input
                                id="excel-file"
                                type="file"
                                name="file"
                                onChange={this.handleImportFile}
                            />
                        </div>
                        <div className="import-excel-btn">
                            <div className="file-uploader-group">
                                {/* <span>Tên file: <strong>{this.state.fileholder}</strong></span> */}
                                <label htmlFor="excel-file" style={{ backgroundColor:'#32a852'}} onChange={this.handleImportFile}>Tải file excel lên (.xls)</label>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        {dataList && dataList.length ?'':
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="component-helper">Hoặc nhập số điện thoại</InputLabel>
                                <Input
                                    variant="outlined"
                                    type="tel"
                                    id="component-helper"
                                    value={singlePhone}
                                    onChange={(event) => {
                                        this.setState({ singlePhone: event.target.value });
                                    }}
                                    aria-describedby="component-helper-text"
                                />
                                <FormHelperText id="component-helper-text">Nhập số điện thoại người dùng</FormHelperText>
                            </FormControl>
                            }
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl variant="outlined" className={classes.formControl}>

                            {/* <InputLabel htmlFor="select-multiple-chip">Chọn voucher</InputLabel> */}
                            <Select
                                variant="outlined"
                                value={voucherId}
                                onChange={(event) => {
                                    this.setState({ voucherId: event.target.value });
                                }}
                                input={<Input name="age" id="age-helper" />}
                            >
                                {
                                    data && data.length ? data.map((option, index) =>
                                        <MenuItem
                                            key={index}
                                            value={option.id}
                                        >
                                            {option.code}
                                        </MenuItem>
                                    ) : null
                                }
                            </Select>
                            <FormHelperText id="component-helper-text">Chọn voucher muốn thêm</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <div className="add-user-btn">
                            <Button
                                style={{ marginTop: 17, marginRight: 20}}
                                className={classes.margin}
                                variant="contained"
                                size="large"
                                color="default"
                                onClick={this.handleAddUser}
                            ><AddIcon />
                            Thêm vào voucher
                                            
                            </Button>
                            <Button
                                onClick={() => this.props.history.push("/admin/voucher")}
                                className={classes.margin}
                                style={{ marginTop: 17}}
                                variant="contained"
                            >
                                Hủy bỏ
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
    render() {
        const { classes } = this.props;
        const {
            dataList,
            // dataPhone,
            // data,
            // voucherId,
            viewable,
            progress

        } = this.state;

        return (
            <div>
                {
                    viewable ?
                        <Paper className={classes.root}>

                            
                                <div className="link-user-tracking-group">

                                    <span
                                        style={{ color: 'black', borderBottom: '1px' }}
                                        className="title-page-user-tracking">
                                        Thêm người dùng vào voucher
                                    </span>
                                </div>

                                <EnhancedTableToolbar
                                    title=""
                                    numSelected={0}
                                    actionsChiren={this.renderChirenToolbar()}
                                />
                                {progress ? <LinearProgress /> : null}
                                {dataList && dataList.length?
                                <div className="table-wrapper">
                                    <Table aria-labelledby="tableTitle">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>STT</TableCell>
                                                <TableCell>Tên</TableCell>
                                                <TableCell>Số điện thoại</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                dataList && dataList.length ? dataList.map((item, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={index}
                                                            tabIndex={-1}>
                                                            <TableCell style={{ wordBreak: "break-all" }}>{index + 1}</TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>{item.Tên}</TableCell>
                                                            <TableCell style={{ wordBreak: "break-all" }}>{item.SDT.replace(/[^\d]/g, '')}</TableCell>
                                                        </TableRow>

                                                    );
                                                })
                                                    :
                                                    <TableRow>
                                                        <TableCell>{this.state.name ? 'Không có kết quả phù hợp' : 'Không có dữ liệu'}</TableCell>
                                                    </TableRow>
                                            }
                                        </TableBody>
                                        <TableFooter>
                                            {/* <TableRow>
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
                                </TableRow> */}
                                        </TableFooter>
                                    </Table>
                                    </div>: ''}

                            

                        </Paper>
                        : "Unauthorized error"
                }
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
        padding: 30
    },
    
    // table: {
    //     minWidth: 2048,
    // },
    // tableWrapper: {
    //     overflowX: 'auto',
    // },
    // textField: {
    //     marginLeft: theme.spacing.unit,
    //     marginRight: theme.spacing.unit,
    // },
});
export default withStyles(styles)(connect(mapStateToProps)(ReadFile));