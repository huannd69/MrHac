import axios from "axios";

var instance = axios.create({
    baseURL: 'http://10.0.40.13:8000/api',
    timeout: 50000
});


//login
export function loginApi(username, password) {
    return instance
        .post("/login", {
            username,
            password,
        })
        .then(response => {
            return response.data;
        })
        .catch(err => err);
}
//Listquestion
export function listQuestion(token) {
    console.log(token);
    return instance
        .get("/list-questions", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            return response.data;
        })
        .catch(err => err);
}
export function createList(data, token) {
    return instance
        .post('/add-list-question', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => {
            console.log('err: ', err.request);

        });
}
export function getSicks(token) {
    return instance
        .get('/list-sicks', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
        .catch(err => err);
}

export function deleteListquestion(list_question_id, token) {
    return instance
        .post('/delete-list-questions', {
            list_question_id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
        .catch(err => err);
}
export function getListReport(token) {
    return instance
        .get('/list-report', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.data;
        })
        .catch(err => err);
}
export function addQuestions(data, token) {
    console.log('data: ', data);
    return instance
        .post('/questions', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function addReply(data, token) {
    console.log('data: ', data);
    return instance
        .put('/add-anwser', { data }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function getQuestions(list_question_id, token) {
    return instance
        .get(`/question-with-id/${list_question_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function confirmReport(id_report, token) {
    return instance
        .post('/confirm-report', id_report, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function deleteReport(id_report, token) {
    return instance
        .post('/delete-report', id_report, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function getReply(question_id, token) {
    return instance
        .get(`/list-anwsers/${question_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function deleteQuestion(id_question, token) {
    return instance
        .post('/delete-questions', id_question, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function editQuestion(id_question, token) {
    return instance
        .post('/edit-questions', id_question, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log('response: ', response);
            return response.data;
        })
        .catch(err => err);
}
export function getListResult(token) {
    return instance.get('/list-result', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        console.log('response: ', response);
        return response.data;
    })
        .catch(err => err);
}
export function updateListResult(data, token) {
    return instance.post('/list-result',data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        console.log('response: ', response);
        return response.data;
    })
        .catch(err => err);
}