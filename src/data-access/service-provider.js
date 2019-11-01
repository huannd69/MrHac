import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

var md5 = require('md5');
export default {
    getAll(hospitalId, param) {
        let parameters =
            (param.specialistId ? '?specialistId=' + param.specialistId : '?specialistId=' + -1) +
            (param.serviceTypeId ? '&serviceTypeId=' + param.serviceTypeId : '&serviceTypeId=' + - 1) +
            (param.name ? '&name=' + param.name : '') + 
            (param.page ? '&page=' + param.page : '') +
            (param.size ? '&size=' + param.size : '')

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.service.getAll + "/" + hospitalId + parameters).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },

}   