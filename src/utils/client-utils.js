import axios from 'axios';
// const server_url = "http://123.24.206.9:8000" ; //dev
const server_url = "http://10.0.40.13:8000"; //test
// const server_url = "https://api.produce.isofhcare.com"; //release
// const server_url = "http://34.95.91.81"; //stable

// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-dev/o/"; //dev
const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-dev/o/"; //test
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofh-care-stable/o/"; //stable
// const resource_url = "https://www.googleapis.com/download/storage/v1/b/isofhcare-storage/o/"; //release


const httpClient = axios.create();
httpClient.defaults.timeout = 50000;

String.prototype.absoluteUrl =
    String.prototype.absolute ||
    function (defaultValue) {
        var _this = this.toString();
        if (_this == "")
            if (defaultValue != undefined) return defaultValue;
            else return _this;

        if (_this.indexOf("http") == 0 || _this.indexOf("blob") == 0) {
            return _this;
        }
        let _this2 = _this.toLowerCase();
        if (
            _this2.endsWith(".jpg") ||
            _this2.endsWith(".png") ||
            _this2.endsWith(".gif")
        ) {
            let image = resource_url + encodeURIComponent(_this + "") + "?alt=media";
            // console.log(image);
            return image;
        }
        if (
            !_this2.endsWith(".jpg") ||
            !_this2.endsWith(".png") ||
            !_this2.endsWith(".gif")
        ) {
            return defaultValue;
        }
        // if(this.startsWith("user"))

        //     return
        return server_url + _this + "";
    };

let browser = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();


String.prototype.getServiceUrl =
    String.prototype.absolute ||
    function (defaultValue) {
        let _this = this ? this.toString() : "";
        if (_this == "")
            if (defaultValue != undefined)
                return defaultValue;
            else
                return _this;
        if (_this.indexOf("http") == 0 || _this.indexOf("blob") == 0) {
            return _this;
        }
        return server_url + _this;
    };



export default {
    // auth: "eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoiaXNvZmhDYXJlIiwiY3JlYXRlZCI6MTU1MzA3MDc0Mzc4NiwidHlwZSI6MCwidXNlcklkIjo1NX0.k8B3Cm5M-22ckpKk3W1fhgHoHq7LGVdKIjhLZUl0abKES5nSCC5RhupsRXctTK6skQMvCZ8f-TuZGbDcNgdlsb_Kc0ogFmaPmGI4ao7MKrCb9nCr4fxztUN0ABWUERA1wnQNFljgVR9FIrNKnf2hx_aTHIrwS9Ol1JOaKJVnj83cK5vg2ExvN7ralb1yoyuHEZoODlDBVHCIxeG5X3oaJE6-BKfcafXau_cmYz-Ovg31VtZpu1lCffaOj2uLSefPBvqfL2d2U1sswiUrV95rankTjOomr31lP4xiCN71-7YX_6Hx7EraRFhmclmaOjGUWM83VB0fvY8hIEHiE8yB8w",
    auth: "",
    serverApi: server_url,
    response: {
        ok(data, message) {
            if (!message)
                message = "";
            return {
                success: true,
                data: data,
                message: message
            }
        },
        noOk(message) {
            if (!message)
                message = "";
            return {
                success: false,
                message: message
            }
        }
    },
    uploadFile(url, file) {
        const formData = new FormData();
        formData.append('file', file)
        const config = {
            headers: {
                // 'content-type': 'multipart/form-data',
                // 'Authorization': this.auth,
                // "deviceType": "web",
                // "deviceOs": browser
                // 'MobileMode':'vendorPortal'
            }
        }

        return axios.post(url.getServiceUrl(), formData, config);
    },
    requestApi(methodType, url, body) {
        return new Promise((resolve, reject) => {
            console.log("Request url " + url + " with token: " + this.auth);
            var dataBody = "";
            if (!body)
                body = {};
            dataBody = JSON.stringify(body);
            
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    // mode: "no-cors",
                    // 'MobileMode':'vendorPortal'
                }, dataBody).then(s => {
                    s.json().then(val => {
                        resolve(val);
                    }).catch(e => { reject(e) });
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestApiVi(methodType, url, body) {
        return new Promise((resolve, reject) => {
            console.log("Request url " + url + " with token: " + this.auth);
            var dataBody = "";
            if (!body)
                body = {};
            dataBody = JSON.stringify(body);
            this.requestFetch(methodType, url && url.indexOf('http') == 0 ? url : (url),
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth,
                    "deviceType": "web",
                    "deviceOs": browser

                    // 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJjcmVhdGVkIjoxNTUzNTcwMjQ1ODkzLCJpc3MiOiJpc29maENhcmUiLCJ2ZW5kb3JJZCI6MTMsInR5cGUiOjAsInVzZXJJZCI6MzY5OX0.Iddf9emNz2YkTt2J9Bfxi-0__St_8y3ndTQpMi3khCt58O0Zh71OP7ij7npl2unD-uXljxmDs8ywDoPUg7tQ8xsSYQNoYVT3esIudP6wKW2qoHV1euKopG9Ra3qH8_9WplmONucPGmzgauVXtdlPxlxdVc-ZZyPp9Ggvv6HxmZ5rcO3PootqG9CbawZjroKp4z2avobmmxKihC3UjJlMCeFSjRrSvZX5XWNhJdtJ2cX3xHyXdvLsR89UkokCckyLX4-I3nFQWsxNMx7RyHx7ymNcyWbaehZRBmZ6ksnnJaPp-YlHNDq9v1JwKqBTkEbiRXJbaOVhB0d4xrYFeJa7Fg',
                    // 'MobileMode':'vendorPortal'
                }, dataBody).then(s => {
                    s.json().then(val => {
                        resolve(val);
                    }).catch(e => { reject(e) });
                }).catch(e => {
                    reject(e);
                });
        });
    },
    requestFetch(methodType, url, headers, body) {
        return new Promise((resolve, reject) => {
            let fetchParam = {
                method: methodType,
                headers,
            }

            if (methodType.toLowerCase() !== "get") {
                fetchParam.body = body;

            }
            console.log('fetchParam: ', fetchParam);
            return fetch(url.getServiceUrl(), fetchParam).then((json) => {
                
                if (!json.ok) {
                    reject(json);
                }
                else
                    resolve(json);
            }).catch((e) => {
                console.log(e);
                reject(e);
            });
        })
    }
}

// format tiền
// Người tạo :DXQuang(5/8/2019)
Number.prototype.formatMoney = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}