import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    getListByUser(id) {
        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.medicalRecord.getListByUser +'/' + id).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },

}   