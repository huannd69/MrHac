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
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import stringUtils from 'mainam-react-native-string-utils';
import bookingProvider from '../../../../data-access/booking-provider';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import RejectPost from './reject-booking';
import CancelPost from './cancel-booking';
import ModalUpdate from './create-update-booking';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailAdmin extends React.Component {
    constructor(props) {
        super(props);
        let confirmable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 268435456).length > 0;
        let canceleable = this.props.userApp.currentUser.permission.filter(item => item.value == 1073741824).length > 0;
        let updateable = this.props.userApp.currentUser.permission.filter(item => item.value == 2147483648).length > 0;

        this.state = {
            open: true,
            dataBooking: this.props.data,
            name: this.props.data && this.props.data.medicalRecords ? this.props.data.medicalRecords.name : '',
            phone: this.props.data && this.props.data.author ? this.props.data.author.phone : '',
            price: this.props.data && this.props.data.service ? this.props.data.service.price : '',
            codeBooking: this.props.data && this.props.data.booking ? this.props.data.booking.codeBooking : '',
            nameService: this.props.data && this.props.data.service ? this.props.data.service.name : '',
            nameServiceType: this.props.data && this.props.data.serviceType ? this.props.data.serviceType.name : '',
            nameDoctor: this.props.data && this.props.data.doctor ? this.props.data.doctor.name : '',
            bookingTime: this.props.data && this.props.data.booking ? this.props.data.booking.bookingTime : '',
            status: this.props.data && this.props.data.booking ? this.props.data.booking.status : '',
            statusCheck: this.props.data && this.props.data.booking ? this.props.data.booking.status : '',
            contact: this.props.data && this.props.data.booking ? this.props.data.booking.contact : '',
            createdDate: this.props.data && this.props.data.booking ? this.props.data.booking.createdDate : '',
            statusPay: this.props.data && this.props.data.booking ? this.props.data.booking.statusPay : '',
            content: this.props.data && this.props.data.booking ? this.props.data.booking.content : '',
            images: this.props.data && this.props.data.booking ? this.props.data.booking.images : '',
            reject: this.props.data && this.props.data.booking ? this.props.data.booking.reject : '',
            modalUpdate: false,
            confirmable,
            canceleable,
            updateable,
            photoIndex: 0,
            isOpen: false,
            modalReject: false,
            modalCancel: false,
            totalPrice: 0,
            listServices: this.props.data && this.props.data.services ? this.props.data.services : '',
            voucherDiscount: 0

        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    componentWillMount() {
        this.checkPrice();
        this.listImages();
        this.totalPrice();
        this.getDetail();
    }

    checkPrice() {
        let a = (this.state.totalPrice || '').toString().split(',');
        if (a[0] == '')
            a = [''];
        a[0] = a[0].replace(/\./g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        if (a.length > 1)
            a[1] = a[1].replace(/\./g, '')

        this.setState({ "totalPrice": a.filter((item, index) => index < 2).join(',') });
    }


    modalUpdate(dataUser) {
        this.setState({
            modalUpdate: true,
            dataUser,
        })
    }

    closeModal() {
        this.setState({ modalUpdate: false, modalCancel: false });
        this.handleClose();
    }

    listImages() {
        if (this.state.images) {
            let listImages = this.state.images.split(',');
            this.setState({
                images: listImages
            })
        }
    }

    approval = (item) => {
        // this.setState({ confirmDialog: false })
        // if (type == 1) {
        // const {  dataBooking, reject } = this.state;
        let object = {
            status: 6,
            reject: "",
            type: 1
        }
        bookingProvider.approved(item.booking.id, object).then(s => {
            if (s && s.code == 0) {
                toast.success("Xác nhận đặt khám của bệnh nhân thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.setState({
                    status: this.state.statusCheck
                });
                this.handleClose();
            } else if (s.code == 3) {
                toast.error("Duyệt đặt khám bắt buộc phải có dịch vụ!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Xác nhận đặt khám của bệnh nhân không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }).catch(e => {
        })

        // }
    }

    modalReject(item) {
        if (this.state.confirmable) {
            this.setState({
                modalReject: true,
                dataBooking: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    modalCancel(item) {
        if (this.state.canceleable) {
            this.setState({
                modalCancel: true,
                dataBooking: item
            })
        } else {
            toast.error("Unauthorized error!", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    modalDetailImage(item) {
        this.setState({
            isOpen: true,
            photoIndex: item
        })
    }

    totalPrice() {
        const { listServices, totalPrice } = this.state;
        let listPrice = [];
        let totalPrice2 = 0
        if (listServices.length > 0) {
            for (let i = 0; i < listServices.length; i++) {
                listPrice.push(Number(listServices[i].price))
            }
            let reducer = (accumulator, currentValue) => accumulator + currentValue;
            totalPrice2 = listPrice.reduce(reducer)
        }
        this.setState({
            totalPrice: totalPrice2
        })
    }
    handleCheckTransfer = (id) => {
        bookingProvider.checkTransfer(id).then(s => {
            if (s && s.code == 0) {
                toast.success("Thay đổi trạng thái thanh toán thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
                console.log(s);
            } else {
                toast.error("Xác nhận trạng thái thanh toán của bệnh nhân không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
                console.log(s);
            }
        }).catch(e => {
            console.log(e)
        })

        // }
    }

    getDetail() {
        bookingProvider.getDetail(this.state.dataBooking.booking.id)
            .then(s => {
                if (s && s.code == 0) {
                    this.setState({
                        voucherDiscount: s.data.discount
                    })
                    console.log(s.data);
                } else {
                    console.log(s);
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    render() {
        const { classes } = this.props;

        const {
            dataBooking,
            nameService,
            listServices,
            totalPrice,
            name,
            isOpen,
            photoIndex,
            updateable,
            bookingTime,
            canceleable,
            status,
            confirmable,
            phone,
            price,
            statusPay,
            codeBooking,
            nameServiceType,
            content,
            imagesreject,
            contact,
            nameDoctor,
            images,
            voucherDiscount
        } = this.state;

        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    fullWidth="md"
                    maxWidth="md"
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        {name}
                        {
                            updateable && (status == 3 || status == 4) ?
                                <Button className="btn-popup-primary" style={{ float: "right" }} onClick={() => this.modalUpdate(dataBooking)} variant="contained" color="inherit"><img src="/images/icon/edit-white.png" alt="" /> Chỉnh sửa</Button> : null

                        }
                    </DialogTitle>
                    <DialogContent>
                        <div className="content-inner">
                            <div className="group-detail">
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Mã đặt lịch:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <p className="content-detail">
                                                {codeBooking}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">SĐT:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <p className="content-detail">{phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Giờ hẹn:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <p className="content-detail">{moment(bookingTime).format("LT DD-MM-YYYY")}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Bác sĩ:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <p className="content-detail">{nameDoctor}</p>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Loại dịch vụ:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <p className="content-detail">{nameServiceType}</p>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Dịch vụ:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <table style={{ marginLeft: '-1.5%' }}>
                                                {
                                                    listServices && listServices.length > 0 ? listServices.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td style={{ width: "60%" }}>{item.name}</td>
                                                                <td>{item.price ? Number(item.price).formatPrice() + "đ" : ""}</td>
                                                            </tr>
                                                        )
                                                    }) : null
                                                }
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Ghi chú và mô tả triệu chứng:</span>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="content-detail">
                                                <p>{content}</p>
                                                <p>
                                                    {
                                                        images && images.length ? images.map((option, index) =>
                                                            <img
                                                                style={{ width: 100, height: 100, marginRight: 20, marginTop: 10 }} alt=""
                                                                onClick={() => this.modalDetailImage(index)}
                                                                src={images ? option.absoluteUrl() : ""}
                                                            />
                                                        ) : null
                                                    }
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="group-detail">
                            <div className="detail-item">
                                <div className="row">
                                    <div className="col-md-3">
                                        <span className="label-detail">Phương thức thanh toán:</span>
                                    </div>
                                    <div className="col-md-9">
                                        <p className="content-detail">
                                            {statusPay == 1 ? "Ví ISOFH" :
                                                statusPay == 2 ? "VNPAY" :
                                                    statusPay == 3 ? "Thanh toán sau tại CSYT" :
                                                        statusPay == 4 ? "PAYOO" :
                                                            statusPay == 5 ? "PAYOO_BILL" :
                                                                statusPay == 6 ? "Chuyển khoản trực tiếp" : null}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="detail-item">
                                <div className="row">
                                    <div className="col-md-3">
                                        <span className="label-detail">Trạng thái:</span>
                                    </div>
                                    <div className="col-md-9">
                                        <p className="content-detail">
                                            {status == 1 ? "Đã hủy (không đến)" :
                                                status == 0 ? "Chờ phục vụ" :
                                                    status == 2 ? "Thanh toán thất bại" :
                                                        status == 3 ? "Đã thanh toán" :
                                                            status == 4 ? "Thanh toán sau" :
                                                                status == 5 ? "Chờ thanh toán" :
                                                                    status == 7 ? "Đã có hồ sơ" :
                                                                        status == 8 ? "Đã hủy (không phục vụ)" : null}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {statusPay == 6 ?
                                <div className="detail-item">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <span className="label-detail">Trạng thái chuyển khoản:</span>
                                        </div>
                                        <div className="col-md-9">
                                            {status == 5 ? 
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className={classes.button}
                                                    onClick={() => this.handleCheckTransfer(dataBooking.booking.id)}
                                                >Xác nhận đã chuyển khoản</Button>
                                                :'Đã chuyển khoản'
                                        }

                                        </div>
                                    </div>
                                </div> : null
                            }

                            {/* <div className="detail-item">
                                <div className="row">
                                    <div className="col-md-3">
                                        <span className="label-detail">Phương thức liên hệ:</span>
                                    </div>
                                    <div className="col-md-9">
                                        <p className="content-detail">
                                            {contact == 1 ? "Điện thoại" :
                                                contact == 2 ? "SMS" : null}
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                            {voucherDiscount > 0 ?
                                <div>
                                    <div className="detail-item">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <span className="label-detail">Tổng tiền dịch vụ ban đầu:</span>
                                            </div>
                                            <div className="col-md-9">
                                                <p className="content-detail text-bold">{totalPrice.formatPrice()}đ</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <span className="label-detail">Ưu đãi:</span>
                                            </div>
                                            <div className="col-md-9">
                                                <p className="content-detail text-bold color-red">-{voucherDiscount.formatPrice()}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div> : null
                            }

                            <div className="detail-item">
                                <div className="row">
                                    <div className="col-md-3">
                                        <span className="label-detail">Tổng tiền:</span>
                                    </div>
                                    <div className="col-md-9">
                                        {voucherDiscount ? <p className="content-detail text-bold color-red">{(totalPrice - voucherDiscount).formatPrice()}đ</p>
                                            : <p className="content-detail text-bold color-red">{totalPrice.formatPrice()}đ</p>}

                                    </div>
                                </div>
                            </div>
                        </div>


                    </DialogContent>
                    {
                        confirmable && (status == 3 || status == 4 ) ?
                            <DialogActions>
                                <Button onClick={() => this.modalReject(dataBooking)} variant="contained" color="inherit">Từ chối</Button>
                                <Button onClick={() => this.approval(dataBooking)} variant="contained" color="primary">Duyệt</Button>
                            </DialogActions> : null
                    }
                    {
                        canceleable && status == 0 ?
                            <DialogActions>
                                <Button onClick={() => this.modalCancel(dataBooking)} variant="contained" color="inherit">Hủy</Button>
                            </DialogActions> : null
                    }
                </Dialog>
                {this.state.modalReject && <RejectPost data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalCancel && <CancelPost data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalUpdate && <ModalUpdate data={dataBooking} callbackOff={this.closeModal.bind(this)} />}
                {isOpen && (
                    <Lightbox
                        mainSrc={images[photoIndex].absoluteUrl()}
                        nextSrc={images[(photoIndex + 1) % images.length].absoluteUrl()}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length].absoluteUrl()}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length,
                            })
                        }
                    />
                )}
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
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailAdmin));