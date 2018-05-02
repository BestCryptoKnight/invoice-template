import axios from 'axios';
import * as moment from 'moment';

export class InvoiceService {

    static BASE_URL = '/api/invoice/';

    static generate(invoice){
        return axios({
            method: 'post',
            url: '/generate',
            data: invoice,
            baseURL: this.BASE_URL
        });
    }
    static send(invoice, user){
        return axios({
            method: 'post',
            url: '/send',
            data: {invoice, user},
            baseURL: this.BASE_URL
        })
    }
    // static findById(id){
    //     return axios({
    //         method: 'get',
    //         url: id,
    //         baseURL: this.BASE_URL
    //     })
    // }
    // static update(id, data){
    //     return axios({
    //         method: 'put',
    //         url: id,
    //         data: data,
    //         baseURL: this.BASE_URL
    //     })
    // }
    // static delete(id){
    //     return axios({
    //         method: 'delete',
    //         url: id,
    //         baseURL: this.BASE_URL
    //     })
    // }
    // static insert(data){
    //     return axios({
    //         method: 'post',
    //         url: '',
    //         data: data,
    //         baseURL: this.BASE_URL
    //     })
    // }
}