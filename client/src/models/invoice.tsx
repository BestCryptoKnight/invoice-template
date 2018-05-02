
import * as moment from 'moment';

export const invoice = {
    //options
    currency: 'USD',
    fields: {
        tax: '%',
        discounts: true,
        shipping: true
    },

    //template    
    header: 'INVOICE',
    to_title: 'Bill To',
    // invoice_number_title: '#',
    date_title: 'Date',
    payment_terms_title: 'Payments Terms',
    due_date_title: 'Due Date',
    // purchase_order_title: '',
    quantity_header: 'Quantity',
    item_header: 'Item',
    unit_cost_header: 'Rate',
    amount_header: 'Amount',
    subtotal_title: 'Subtotal',
    discounts_title: 'Discounts',
    tax_title: 'Tax',
    shipping_title: 'Shipping',
    total_title: 'Total',
    amount_paid_title: 'Amount Paid',
    balance_title: 'Balance Due',
    terms_title: 'Terms',
    notes_title: 'Notes',

    //invoice    
    logo: '',
    from: '',
    to: '',
    number: '',
    purchase_order: '',
    date: moment().format("LL"),
    payment_terms: '',
    due_date: moment().format("LL"),
    items: [
        {
            name: '',
            quantity: 0,
            unit_cost: 0,
            description: ''
        }
    ],
    discounts: 0,
    tax: 0,
    shipping: 0,
    amount_paid: 0,
    notes: '',
    terms: '',
}

// export class InvoiceModel {
//     public logo;
//     public from;
//     public to;
//     public number;
//     public purchase_order;
//     public date;
//     public payment_terms;
//     public due_date;
//     public items;
//     public discounts :number;
//     public tax :number;
//     public shipping :number;
//     public amount_paid :number;
//     public notes;
//     public terms;
//     public currency;
//     public fields;

//     constructor(){
//         this.hydrate({});
//     }
//     hydrate(object){
//         this.logo = object.logo || '';
//         this.from = object.from || '';
//         this.to = object.to || '';
//         this.number = object.number || '';
//         this.purchase_order = object.purchase_order || '';
//         this.date = object.date || moment().format("LL");
//         this.payment_terms = object.payment_terms || '';
//         this.due_date = object.due_date || moment().format("LL");
//         this.items = object.items || [{
//                                            name: '',
//                                            quantity: 0,
//                                            unit_cost: 0,
//                                            description: ''
//                                         }];
//         this.discounts = object.discounts || 0;
//         this.tax = object.tax || 0;
//         this.shipping = object.shipping || 0;
//         this.amount_paid = object.amount_paid || 0;
//         this.notes = object.notes || '';
//         this.terms = object.terms || '';
//         this.currency = object.currency || 'USD';
//         this.fields = object.fields || {
//                                             tax: '%',
//                                             discounts: true,
//                                             shipping: true
//                                         };
//     }
// }