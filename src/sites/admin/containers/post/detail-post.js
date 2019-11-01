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
import userProvider from '../../../../data-access/user-provider';
import commentProvider from '../../../../data-access/comment-provider';
import Avatar from '@material-ui/core/Avatar';
import { bool } from 'prop-types';
import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Done from '@material-ui/icons/Done';
import Grade from '@material-ui/icons/Grade';
import GradeOutlined from '@material-ui/icons/GradeOutlined';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ApprovalListPost from './approval-list-post';
import ApprovalPost from './approval-post';
import RejectPost from './reject-post';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import roleProvider from '../../../../data-access/role-provider';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class DetailPost extends React.Component {
    constructor(props) {
        super(props);
        let viewable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 16384).length > 0;
        let updateable = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 32768).length > 0;
        let viewableDoctor = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 128).length > 0;
        let viewableUser = (this.props.userApp.currentUser.permission || {}).filter(item => item.value == 16).length > 0;

        this.state = {
            open: true,
            dataPost: this.props.post,
            title: this.props.post && this.props.post.post ? this.props.post.post.title : '',
            content: this.props.post && this.props.post.post ? this.props.post.post.content : '',
            gender: this.props.post.post ? this.props.post.post.gender : '',
            images: this.props.post && this.props.post.post ? this.props.post.post.images : '',
            age: this.props.post && this.props.post.post ? this.props.post.post.age : '',
            status: this.props.post && this.props.post.post ? this.props.post.post.status : '',
            assignee: this.props.post && this.props.post.assignee ? this.props.post.assignee : null,
            isAssigned: this.props.post && this.props.post.post ? this.props.post.post.isAssigned : '',
            isAnswered: this.props.post && this.props.post.post ? this.props.post.post.isAnswered : '',
            isPrivate: this.props.post && this.props.post.post ? this.props.post.post.isPrivate : '',
            author: this.props.post && this.props.post.author ? this.props.post.author : '',
            specialist: this.props.post && this.props.post.specialist ? this.props.post.specialist.name : '',
            createdDate: this.props.post && this.props.post.post ? this.props.post.post.createdDate : '',
            updatedDate: this.props.post && this.props.post.post ? this.props.post.post.updatedDate : '',
            review: this.props.post && this.props.post.post ? this.props.post.post.review : '',
            reject: this.props.post && this.props.post.post ? this.props.post.post.reject : '',
            postType: this.props.post && this.props.post.post ? this.props.post.post.postType : '',
            otherContent: this.props.post && this.props.post.post ? this.props.post.post.otherContent : '',
            diagnose: this.props.post && this.props.post.post ? this.props.post.post.diagnose : '',
            progress: false,
            modalApproval: false,
            modalReject: false,
            listDoctors: [],
            userAuthor: {},
            listComment: [],
            page: 0,
            size: 20,
            postId: this.props.post.post.id,
            isCheck: '',
            isChecks: [],
            diseaseHistory: this.props.post && this.props.post.post ? this.props.post.post.diseaseHistory : '',
            photoIndex: 0,
            viewable,
            updateable,
            viewableUser,
            viewableDoctor,
            listIcon: [
                {
                    id: 1,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Tim mạch",
                    image: "/heart1.png",
                    imageInactive: "/heart2.png"
                },
                {
                    id: 32,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Dạ dày",
                    image: "/stomach.png",
                    imageInactive: "/stomach1.png"
                },
                {
                    id: 64,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Xương khớp",
                    image: "/femur.png",
                    imageInactive: "/femur1.png"
                },
                {
                    id: 16,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Hô hấp",
                    image: "/lungs.png",
                    imageInactive: "/lungs1.png"
                },
                {
                    id: 4,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Tiểu đường",
                    image: "/rectangle.png",
                    imageInactive: "/rectangle2.png"
                },
                {
                    id: 8,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "HIV",
                    image: "/ribbon.png",
                    imageInactive: "/ribbon1.png"
                },
                {
                    id: 128,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Thiếu chất",
                    image: "/orange.png",
                    imageInactive: "/orange1.png"
                },
                {
                    id: 2,
                    iconActive: "Favorite",
                    iconInactive: "FavoriteBorder",
                    title: "Mỡ máu",
                    image: "/pureWaterDrop.png",
                    imageInactive: "/pureWaterDrop@2x.png"
                },
            ]
        };
    }

    componentWillMount() {
        this.listImages();
        this.userAuthor();
        this.getDoctors();
        this.getComment();
        this.getReview();
        this.getCheckDiseaseHistory();
    }


    getDoctors() {
        let params = {
            page: 1,
            size: 99999,
            active: 1,
            type: 1,
        }
        userProvider.search(params).then(s => {
            let dataTemp = [{
                user: {
                    id: -1,
                    name: '--- Chọn bác sĩ ---'
                }
            }]
            for (var i = 0; i < s.data.data.length; i++) {
                dataTemp.push(s.data.data[i])
            }
            if (s && s.code == 0 && s.data) {
                this.setState({
                    listDoctors: dataTemp
                })
            }
        }).catch(e => {
        })
    }

    getReview() {
        const { classes } = this.props;
        return [1, 2, 3, 4, 5].map((item, index) => {
            return <div key={index}>
                {
                    item <= this.state.review ?
                        <IconButton color="primary" className={classes.button} aria-label="Grade">
                            <Grade />
                        </IconButton> :
                        <IconButton color="primary" className={classes.button} aria-label="GradeOutlined">
                            <GradeOutlined />
                        </IconButton>
                }
            </div>
        })

    };


    getCheckDiseaseHistory() {
        const { classes } = this.props;
        const { listIcon } = this.state;

        return listIcon.map((item, index) => {
            let check = item.id & this.state.diseaseHistory;
            return <span key={index}>
                {
                    <Tooltip title={item.title}>
                        <img
                            style={{ width: 30, height: 30, marginRight: 20, marginTop: 20, marginBottom: 15 }} alt="Remy Sharp"
                            src={check == item.id ? item.image : item.imageInactive}
                        />
                    </Tooltip>
                }
            </span>
        })
    }

    getComment() {
        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            postId: this.state.postId,
        }
        commentProvider.search(params).then(s => {
            if (s && s.code == 0 && s.data) {
                this.setState({
                    listComment: s.data.data
                })
            }
        }).catch(e => {
        })
    }

    userAuthor() {
        // let id = this.state.author.id;
        // userProvider.getDetail(id).then(s => {
        //     if (s && s.code == 0 && s.data) {
        //         this.setState({
        //             userAuthor: s.data.user,
        //         })
        //     }
        //     this.setState({ progress: false })
        // }).catch(e => {
        //     this.setState({ progress: false })
        // })
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    closeModal() {
        this.setState({ modalApproval: false, modalReject: false });
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

    modalDetailImage(item) {
        this.setState({
            isOpen: true,
            photoIndex: item
        })
    }

    handleDetailImage(item) {
        this.setState({
            handleDetailImage: true,
            image: item
        })
    }

    render() {
        const { classes } = this.props;
        const { dataPost, listDoctors, photoIndex, isOpen, listImages, image, isChecks, listComment, diagnose, title, content, images, status, assignee, isAssigned, isAnswered, author, review, reject, createdDate, postType, updatedDate, gender, age, specialist, otherContent, userAuthor, isPrivate, viewable, viewableDoctor, viewableUser, updateable } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                {
                    viewable ?
                        <Dialog
                            open={this.state.open}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={this.handleClose}
                            fullWidth="md"
                            maxWidth="md"
                            aria-labelledby="alert-dialog-slide-title"
                            aria-describedby="alert-dialog-slide-description">
                            <DialogTitle className="alert-dialog-slide-title">
                                Chi tiết câu hỏi
                    </DialogTitle>
                            <DialogContent>
                                <Row style={{ marginLeft: 24 }}>
                                    <Col xs="12" sm="2" md="2">
                                        <div class="row mgbt-xs-0">
                                            <Avatar
                                                style={{ width: 80, height: 80 }} alt="Remy Sharp"
                                                src={userAuthor.avatar ? userAuthor.avatar.absoluteUrl() : "/Profile1.png"}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs="12" sm="10" md="10">
                                        {
                                            isPrivate == 1 ?
                                                <div class="row mgbt-xs-0">
                                                    <div class="col-xs-7 controls" className={classes.controls}>Ẩn danh</div>
                                                </div> :
                                                <div class="row mgbt-xs-0">
                                                    {
                                                        viewableUser ?
                                                            <Link class="col-xs-7 controls" className={classes.controls}
                                                                style={{ textDecoration: 'none', color: 'black' }}
                                                                to={'/admin/user?id=' + author.id}>{author.name}</Link> :
                                                            <div class="col-xs-7 controls" className={classes.controls}
                                                                style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handlecheckUser()}>
                                                                {author.name}
                                                            </div>
                                                    }
                                                </div>
                                        }
                                        <div class="row mgbt-xs-0">
                                            <div class="col-xs-7 controls" className={classes.controls}>{gender == 0 ? 'NỮ' : gender == 1 ? 'NAM' : gender == 2 ? 'Không xác định' : ''}</div>
                                            {
                                                age == 0 ? " " : <div class="col-xs-7 controls" className={classes.controls}> - {age} tuổi</div>
                                            }
                                        </div>
                                        <div class="row mgbt-xs-0">
                                            <div class="col-xs-7 controls" className={classes.controls}>Chuyên khoa: {specialist}</div>
                                        </div>
                                        <div class="row mgbt-xs-0">
                                            <div class="col-xs-7 controls" className={classes.controls}>{createdDate.toDateObject('-').getPostTime()}</div>
                                        </div>
                                        {
                                            this.getCheckDiseaseHistory()
                                        }
                                        <div class="row mgbt-xs-0">
                                            <div class="col-xs-7 controls" className={classes.controls} style={{ textAlign: 'justify', width: '98%'}}>{content}</div>
                                        </div>
                                        {
                                            otherContent ?
                                                <div class="row mgbt-xs-0">
                                                    <div class="col-xs-7 controls" className={classes.controls} style={{ fontWeight: "bold" }}>Thông tin khác</div>
                                                    <div class="col-xs-7 controls" className={classes.controls}>: {otherContent}</div>
                                                </div> : ''
                                        }
                                        {
                                            images ?
                                                <div>
                                                    <div class="row mgbt-xs-0">
                                                        <div class="col-xs-7 controls" className={classes.controls} style={{ fontWeight: "bold" }}>Ảnh đính kèm:</div>
                                                    </div>
                                                    <div class="row mgbt-xs-0">
                                                        {
                                                            images.map((option, index) =>
                                                                <img
                                                                    style={{ width: 100, height: 100, marginRight: 20, marginTop: 16 }} alt=""
                                                                    onClick={() => this.modalDetailImage(index)}
                                                                    src={images ? option.absoluteUrl() : ""}
                                                                />
                                                            )
                                                        }

                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            reject ?
                                                <div class="row mgbt-xs-0">
                                                    <div class="col-xs-7 controls" className={classes.controls} style={{ fontWeight: "bold" }}>Lý do từ chối</div>
                                                    <div class="col-xs-7 controls" className={classes.controls}>: {reject}</div>
                                                </div> : ''
                                        }
                                    </Col>
                                    {
                                        status == 2 ?
                                            <Col xs="12" sm="2" md="2">
                                                <IconButton color="primary" className={classes.button} aria-label="Done" style={{ marginLeft: 30 }}>
                                                    <Done />
                                                </IconButton>
                                            </Col>
                                            : null
                                    }
                                    {
                                        status == 2 ?
                                            <Col xs="12" sm="10" md="10">
                                                <div class="row mgbt-xs-0">
                                                    <div class="col-xs-7 controls" className={classes.controls}>{assignee.name}</div>
                                                </div>
                                            </Col>
                                            : null
                                    }
                                    <div style={{ width: '100%', borderBottom: '1px solid white', marginRight: 80, marginTop: 30 }}></div>
                                </Row>
                                {
                                     (status == 3 || status == 6) && listComment && assignee ?
                                        <Row style={{ marginLeft: 10 }}>
                                            {
                                                listComment.map((option, index) =>
                                                    <Col xs="12" sm="12" md="12">
                                                        <Col xs="12" sm="2" md="2">
                                                            {
                                                                option.user.id === this.state.assignee.id ?
                                                                    <div class="row mgbt-xs-0">
                                                                        {gender == 1 ?
                                                                            <Avatar
                                                                                style={{ width: 80, height: 80 }} alt="Remy Sharp"
                                                                                src={option.user.avatar ? option.user.avatar.absoluteUrl() : "/avatarDoctorFemale.png"}
                                                                            /> :
                                                                            <Avatar
                                                                                style={{ width: 80, height: 80 }} alt="Remy Sharp"
                                                                                src={option.user.avatar ? option.user.avatar.absoluteUrl() : "/avatarDoctorMale.png"}
                                                                            />
                                                                        }
                                                                    </div> :
                                                                    <div class="row mgbt-xs-0">
                                                                        <Avatar
                                                                            style={{ width: 80, height: 80 }} alt="Remy Sharp"
                                                                            src={userAuthor.avatar ? userAuthor.avatar.absoluteUrl() : "/Profile1.png"}
                                                                        />
                                                                    </div>
                                                            }
                                                        </Col>
                                                        <Col xs="12" sm="10" md="10">
                                                            <div class="row mgbt-xs-0">
                                                                {/* <Link class="col-xs-7 controls" className={classes.controls} 
                                                            style={{ textDecoration: 'none', color: 'black' }} 
                                                            to={'/admin/doctor?id=' + assignee.id}>{option.user.name}</Link> */}
                                                                {
                                                                    viewableDoctor ?
                                                                        <Link class="col-xs-7 controls" className={classes.controls}
                                                                            style={{ textDecoration: 'none', color: 'black' }}
                                                                            to={'/admin/doctor?id=' + assignee.id}>{option.user.name}</Link> :
                                                                        <div class="col-xs-7 controls" className={classes.controls}
                                                                            style={{ textDecoration: 'none', color: 'black' }} onClick={() => this.handlecheckDoctor()}>
                                                                            {option.user.name}
                                                                        </div>
                                                                }
                                                            </div>
                                                            <div class="row mgbt-xs-0">
                                                                <div class="col-xs-7 controls" className={classes.controls}>{option.comment.createdDate.toDateObject('-').getPostTime()}</div>
                                                            </div>
                                                            <div class="row mgbt-xs-0">
                                                                <div class="col-xs-7 controls" className={classes.controls} style={{ textAlign: 'justify'}}>{option.comment.content}</div>
                                                            </div>
                                                            <div style={{ width: '100%', borderBottom: '1px solid white', marginRight: 80, marginTop: 30 }}></div>
                                                        </Col>
                                                    </Col>
                                                )
                                            }

                                        </Row> : null
                                }
                                <Row style={{ marginLeft: 40 }}>
                                    {
                                        diagnose ?
                                            <Col xs="12" sm="12" md="12">
                                                <div class="row mgbt-xs-0">
                                                    <div class="col-xs-7 controls" className={classes.controls} style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: 18, marginTop: 20 }}>Chuẩn đoán </div>
                                                    <div style={{ marginLeft: 20, marginTop: 15, border: '1px solid black', paddingLeft: 9, paddingRight: 15, textTransform: 'uppercase' }}>{diagnose}</div>
                                                </div>
                                            </Col> : null
                                    }
                                </Row>
                                <Row style={{ marginLeft: 40 }}>
                                    {
                                        (status == 3 || status == 6) && isChecks ?
                                            <Col xs="12" sm="12" md="12">
                                                <div class="row mgbt-xs-0">
                                                    <div style={{ width: '100%', borderBottom: '1px solid', marginRight: 80, marginTop: 15 }}></div>
                                                    <div class="col-xs-7 controls" className={classes.controls} style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: 22, marginTop: 8 }}>Đánh giá </div>
                                                    {
                                                        this.getReview()
                                                    }


                                                </div>
                                            </Col> : null
                                    }
                                </Row>
                            </DialogContent>
                            {
                                status == 1 && updateable ?
                                    <DialogActions>
                                        <Button onClick={() => this.modalApproval(dataPost)} variant="contained" color="primary">Duyệt</Button>
                                        <Button onClick={() => this.modalReject(dataPost)} variant="contained" color="inherit">Từ chối</Button>
                                        {/* <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button> */}
                                    </DialogActions> :
                                    status == 2 ?
                                        <DialogActions>
                                            <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                                        </DialogActions> :
                                        status == 3 ?
                                            <DialogActions>
                                                <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                                            </DialogActions> :
                                            status == 5 && updateable ?
                                                <DialogActions>
                                                    <Button onClick={() => this.modalApproval(dataPost)} variant="contained" color="inherit">Chuyển</Button>
                                                </DialogActions> :
                                                <DialogActions>
                                                    <Button onClick={this.handleClose} variant="contained" color="inherit">Cancel</Button>
                                                </DialogActions>
                            }
                        </Dialog>
                        : "Unauthorized error"}

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
                {this.state.modalApproval && <ApprovalPost post={dataPost} doctors={listDoctors} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalReject && <RejectPost post={dataPost} callbackOff={this.closeModal.bind(this)} />}
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
    }, controlLabel: {
        width: 150,
        marginTop: 10,
        marginBottom: 20,
    }, controls: {
        marginTop: 10,
    }
});

export default withStyles(styles)(connect(mapStateToProps)(DetailPost));