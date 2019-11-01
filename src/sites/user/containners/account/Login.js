import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import clientUtils from '../../../../utils/client-utils';
import userProvider from '../../../../data-access/user-provider';
import dataCacheProvider from '../../../../data-access/datacache-provider';
import constants from '../../../../resources/strings';
import { loginApi } from '../../../../utils/apiAxios'
var md5 = require('md5');
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  componentWillMount() {
    // this.checkUserLogin();
  }

  checkUserLogin() {
    if (this.props.userApp.currentUser) {
      debugger
      this.props.history.push("/admin/doctor");
    } else {
      this.props.history.push("/dang-nhap");
    }
  }

  componentDidMount() {

  }

  login = () => {
    const { username, password } = this.state;
    loginApi(username, password).then(res => {
      console.log(res);
      if (res.code == 200) {
        console.log(res);
        let user = res;
        this.props.dispatch({ type: constants.action.action_user_login, value: user })
        dataCacheProvider.save("", constants.key.storage.current_account, user).then(s => {
          console.log(this.props);
          this.props.history.push("/admin/role");
        });
      }else{
        toast.error('Đăng nhập không thành công!', {
          position: toast.POSITION.TOP_RIGHT
      });
      }
    }).catch(err => {
      console.log(err)
    })
    // const { username, password } = this.state;
    // if (!username || !password) {
    //   toast.error("Vui lòng nhập username/password! ", {
    //     position: toast.POSITION.TOP_RIGHT
    //   });
    // } else {
    //   console.log(username, password,'username, password');
    //   userProvider.login(username, password.trim()).then(s => {
    //     switch (s.code) {
    //       case 0:
    //         if (s.data.user.role == 4) {
    //           let user = s.data.user;
    //           user.permission = (s.data.permission||[]);
    //           this.props.dispatch({type: constants.action.action_user_login, value: user})
    //           dataCacheProvider.save("", constants.key.storage.current_account, user).then(s => {
    //             this.props.history.push("/admin/doctor");
    //           });
    //           console.log(s);

    //         } else {
    //           toast.error("Username hoặc password không hợp lệ!", {
    //             position: toast.POSITION.TOP_RIGHT
    //           });
    //         }
    //         break;
    //       case 1:
    //         alert('code 1');
    //         break;
    //       case 2:
    //         toast.error("Tài khoản đã bị inactive. Vui lòng liên hệ với Admin! ", {
    //           position: toast.POSITION.TOP_RIGHT
    //         });
    //         break;
    //       case 3:
    //         toast.error("Username hoặc password không hợp lệ!", {
    //           position: toast.POSITION.TOP_RIGHT
    //         });
    //         break;
    //     }
    //   }).catch(e => {
    //     console.log(e);

    //   })
    // }

  }

  render() {
    const { username, password } = this.state;

    return (
      // <div className="app flex-row align-items-center">
      //   <div className="container">
      //     <div className="row justify-content-center">
      //       <div className="col-md-8">
      //         <div className="card-group">
      //           <div className="card p-4">
      //             <div className="card-body">
      //               <h1 style={{ textAlign: 'left' }}>Login</h1>
      //               <p className="text-muted" style={{ textAlign: 'left' }}>Sign In to your account</p>
      //               <div className="input-group mb-3">
      //                 <div className="input-group-prepend">
      //                   <span className="input-group-text">
      //                     <i className="icon-user"></i>
      //                   </span>
      //                 </div>
      //                 <input className="form-control" type="text"
      //                   placeholder="Username/Email" value={username}
      //                   onChange={(event) => this.setState({ username: event.target.value })}></input>
      //               </div>
      //               <div className="input-group mb-4">
      //                 <div className="input-group-prepend">
      //                   <span className="input-group-text">
      //                     <i className="icon-lock"></i>
      //                   </span>
      //                 </div>
      //                 <input className="form-control" type="password"
      //                   placeholder="Password" value={password}
      //                   onChange={(event) => this.setState({ password: event.target.value })}
      //                   onKeyPress={e => {
      //                     if (e.key === 'Enter') {
      //                       this.login()
      //                     }
      //                   }}>
      //                 </input>
      //               </div>
      //               <div className="row">
      //                 <div className="col-6">
      //                   <button className="btn btn-primary px-4" type="button" onClick={() => { this.login() }}>Login</button>
      //                 </div>
      //                 <div className="col-6 text-right">
      //                   <button className="btn btn-link px-0" type="button">Forgot password?</button>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //           <div className="card text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
      //             <div className="card-body text-center">
      //               <div>
      //                 <h2>Sign up</h2>
      //                 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      //                 <button className="btn btn-primary active mt-3" type="button">Register Now!</button>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      <div className="app login-page flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center row-login">
            <div className="card text-white  left-form form-item" >
            </div>
            <div className="right-form form-item">
              <div className="">
                <h1 className="logo-login"><img src="/images/logo-login.png" alt="" /></h1>
                <p className="text-muted">Xin chào, Xin mời đăng nhập bằng tài khoản của bạn!</p>
                <div className="input-group-inner">
                  <span className="input-group-label">
                    Email
                        </span>
                  <input className="form-control" type="text"
                    placeholder="Username/Email" value={username}
                    onChange={(event) => this.setState({ username: event.target.value })} />
                </div>
                <div className="input-group-inner">

                  <span className="input-group-label">
                    Mật khẩu
                        </span>
                  <input className="form-control" type="password"
                    placeholder="Mật khẩu" value={password}
                    onChange={(event) => this.setState({ password: event.target.value })}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        this.login()
                      }
                    }}>
                  </input>
                </div>
                <p className="fogot-pass"><a href="#" >Quên mật khẩu?</a></p>
                <div className="row text-center" >
                  <div className="col-5 text-right">
                    <a href="#" className="register-link" > Đăng ký tài khoản</a>
                  </div>
                  <div className="col-7">
                    <button className="button-new btn-login" type="button" onClick={this.login}> Đăng nhập</button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Login);