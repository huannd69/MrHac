
export default {
    clone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            return null;
        }
    }
}

