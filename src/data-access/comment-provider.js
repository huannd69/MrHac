import client from '../utils/client-utils';
import stringUtils from 'mainam-react-native-string-utils';
import constants from '../resources/strings';
import datacacheProvider from './datacache-provider';
import clientUtils from '../utils/client-utils';

export default {
    search(param) {
        let parameters =
            (param.page ? '?page=' + param.page : '?page=' + -1) +
            (param.size ? '&size=' + param.size : '&size=' + - 1) +
            (param.postId ? '&postId=' + param.postId : '&postId=' + - 1)

        return new Promise((resolve, reject) => {
            clientUtils.requestApi("get", constants.api.comment.search + parameters, {}).then(x => {
                resolve(x);
            }).catch(e => {
                reject(e);
            })
        })
    },
}