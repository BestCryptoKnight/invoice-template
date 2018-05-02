import * as React from "react";
import { Row, Col, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, 
        Navbar, NavbarBrand, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Link } from 'react-router';
import {invoice} from '../../models/invoice';
import {user} from '../../models/user';
import {currency_sign_object} from '../../models/currency';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import { calc_subTotal, calc_total, calc_balanceDue} from '../../services/helper';
import { InvoiceService } from '../../services/invoice';
import Swal from 'sweetalert2';
import EditableLabel from 'react-inline-editing';


export class Dashboard extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.toggleSendModal = this.toggleSendModal.bind(this);
        this.toggleInvoicesModal = this.toggleInvoicesModal.bind(this);
        this.state = {
            invoice: invoice,
            user: user,
            sendModal: false,
            invoicesModal: false,

            currency_sign: '$'
        };
    }
    updateInvoice(props, value){
        this.state.invoice[props] = value;
        this.setState({ invoice: this.state.invoice });
    }
    updateUser(props, value){
        this.state.user[props] = value;
        this.setState({ user: this.state.user });
    }
    updateItem(index, props, value){
        this.state.invoice.items[index][props] = value;
        this.setState({ invoice: this.state.invoice });
    }
    updateCurrency(value){
        this.updateInvoice('currency', value);
        this.setState({ currency_sign: currency_sign_object[value] });
    }
    addItem(){
        this.state.invoice.items.push({
            name: '',
            quantity: 0,
            unit_cost: 0,
            description: ''
        });
        this.setState({ invoice: this.state.invoice });
    }
    removeItem(index){
        this.state.invoice.items.splice(index, 1);
        this.setState({ invoice: this.state.invoice });
    }
    onDrop(files) {
        let file = files[0];
        if(file.size > 768000 ){
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Max file size is 750KB !',
            })
            return false;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.state.invoice.logo=reader.result;
            this.setState({ invoice: this.state.invoice });
        }
    }
    removeLogo(){
        this.state.invoice.logo='';
        this.setState({ invoice: this.state.invoice });
    }
    saveToLocal(){
        let localInvoices = JSON.parse(localStorage.getItem("invoices"));
        if(!localInvoices) localInvoices=[];
        const item={
            invoice: this.state.invoice,
            time: moment().format('LLL')
        }
        localInvoices.push(item);
        localStorage.setItem('invoices', JSON.stringify(localInvoices));
    }
    generate(){
        this.saveToLocal();
        InvoiceService.generate(this.state.invoice).then(resp=>{
            this.download(resp.data);
        })
    }
    download(base64String) {
        var element = document.createElement('a');
        element.setAttribute('href', base64String);
        element.setAttribute('download', 'invoice.pdf');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }
    sendInvoice(){
        this.saveToLocal();
        this.toggleSendModal();
        InvoiceService.send(this.state.invoice, this.state.user).then(resp=>{
            Swal({
                type: 'success',
                title: 'Success',
                text: 'Email sent!'
            })
        }).catch(resp=>{
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Sending email is failed!',
            })
        })
    }
    toggleSendModal() {
        this.setState({ sendModal: !this.state.sendModal });
    }
    toggleInvoicesModal(){
        this.setState({ invoicesModal: !this.state.invoicesModal })
    }
    selectInvoice(invoice){
        this.toggleInvoicesModal();
        this.setState({ invoice: invoice });
    }
    clearLocalInvoices(){        
        this.toggleInvoicesModal();
        localStorage.removeItem('invoices');
    }
    render() {
        let localInvoices = JSON.parse(localStorage.getItem("invoices"));
        if(!localInvoices) localInvoices=[];
        return (
            <div className="">
                <Modal isOpen={this.state.sendModal} toggle={this.toggleSendModal} >
                    <ModalHeader toggle={this.toggleSendModal}>Send Invoice</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>To</Label>
                            <Input
                                type="text"
                                placeholder="Your client email address"
                                value={this.state.user.to}
                                onChange={e => this.updateUser('to', e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>From</Label>
                            <Input
                                type="text"
                                placeholder="Your email address"
                                value={this.state.user.from}
                                onChange={e => this.updateUser('from', e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Message</Label>
                            <Input
                                type="textarea"
                                style={{height: 100}}
                                placeholder="A friendly message to your client"
                                value={this.state.user.message}
                                onChange={e => this.updateUser('message', e.target.value)}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.sendInvoice.bind(this)}>Send</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.invoicesModal} toggle={this.toggleInvoicesModal} size="lg">
                    <ModalHeader toggle={this.toggleInvoicesModal}>My Invoices</ModalHeader>
                    <ModalBody>
                        <hr/>
                        <div className="item_wrapper" style={{fontWeight: 'bold'}}>
                            <div className="item_no">#</div>
                            <div className="item_number">Number</div>
                            <div className="item_from">From</div>
                            <div className="item_to">To</div>
                            <div className="item_time">Time</div>
                        </div>
                        <hr/>
                        {
                            localInvoices.map((item, index)=>{
                                return(
                                    <div key={index} >
                                        <div className="invoice_list item_wrapper" onClick={()=>this.selectInvoice(item.invoice)} >
                                            <div className="item_no">{index+1}</div>
                                            <div className="item_number">{item.invoice.number}</div>
                                            <div className="item_from">{item.invoice.from}</div>
                                            <div className="item_to">{item.invoice.to}</div>
                                            <div className="item_time">{item.time}</div>
                                        </div>
                                        <hr/>
                                    </div>
                                )
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.clearLocalInvoices.bind(this)}>Clear</Button>
                        <Button color="primary" onClick={this.toggleInvoicesModal.bind(this)}>Ok</Button>
                    </ModalFooter>
                </Modal>
                <Navbar color="dark" dark >
                    <NavbarBrand href="/">Invoice-Generater</NavbarBrand>
                    <div className="currency_select">
                        <div>Currency</div>{' '}
                        <Input
                            type="select"
                            value={this.state.invoice.currency}
                            onChange={ e => this.updateCurrency(e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </Input>
                    </div>
                    <div>
                        <Button color="success" onClick={this.toggleInvoicesModal.bind(this)}>My invoices</Button>&nbsp;&nbsp;
                        <Button color="success" onClick={this.generate.bind(this)}>Download</Button>&nbsp;&nbsp;
                        <Button color="success" onClick={this.toggleSendModal.bind(this)}>Send</Button>
                    </div>
                </Navbar>
                <div className="main_w">
                    <div className="paper">
                        <div className="top_w">
                            <div className="left_w">
                                {
                                    this.state.invoice.logo?
                                        <FormGroup>
                                            <div className="logo_w">
                                                <img src={this.state.invoice.logo} className="logo_img" />
                                                <div className="remove_logo" onClick={()=>this.removeLogo()}>
                                                    &times;
                                                </div>
                                            </div>
                                        </FormGroup>
                                    :
                                    <FormGroup>
                                        <Dropzone
                                            accept="image/jpeg, image/png"
                                            onDrop={(accepted, rejected)=>this.onDrop(accepted)}
                                        >
                                            <p className="dropzone_desc">+ Add Your Logo</p>
                                        </Dropzone>
                                    </FormGroup>
                                }
                                <FormGroup>
                                    <Input
                                        type="textarea"
                                        placeholder="Who is this invoice from?(required)" 
                                        value={this.state.invoice.from}
                                        onChange={e => this.updateInvoice('from', e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <EditableLabel 
                                        text={this.state.invoice.to_title}
                                        labelClassName='inline_label width_200'
                                        inputClassName='inline_input width_200'
                                        onFocusOut={value => this.updateInvoice('to_title', value)}
                                    />
                                    <Input 
                                        type="textarea"
                                        placeholder="Who is this invoice to?(required)" 
                                        value={this.state.invoice.to}
                                        onChange={e => this.updateInvoice('to', e.target.value)}
                                    />
                                </FormGroup>
                            </div>
                            <div className="right_w">
                                <EditableLabel 
                                    text={this.state.invoice.header}
                                    labelClassName='inline_label width_400 right_text title'
                                    inputClassName='inline_input width_400 right_text title'
                                    onFocusOut={value => this.updateInvoice('header', value)}
                                />
                                <FormGroup>
                                    <InputGroup className="invoice_id_input_group">
                                        <InputGroupAddon addonType="prepend">#</InputGroupAddon>
                                        <Input 
                                            className="invoice_id_input"
                                            type="text"
                                            value={this.state.invoice.number}
                                            onChange={e => this.updateInvoice('number', e.target.value)}
                                        />
                                    </InputGroup>
                                </FormGroup>
                                <div className="right_align_input_group">
                                    <EditableLabel 
                                        text={this.state.invoice.date_title}
                                        labelClassName='inline_label width_200 right_text'
                                        inputClassName='inline_input width_200 right_text'
                                        onFocusOut={value => this.updateInvoice('date_title', value)}
                                    />
                                    <DatePicker 
                                        className="form-control"
                                        dateFormat="LL"
                                        selected={moment(this.state.invoice.date, "LL")}
                                        onChange={value => this.updateInvoice('date', value.format("LL"))}
                                    />
                                </div>
                                <div className="right_align_input_group">
                                    <EditableLabel 
                                        text={this.state.invoice.payment_terms_title}
                                        labelClassName='inline_label width_200 right_text'
                                        inputClassName='inline_input width_200 right_text'
                                        onFocusOut={value => this.updateInvoice('payment_terms_title', value)}
                                    />
                                    <Input 
                                        type="text"
                                        value={this.state.invoice.payment_terms}
                                        onChange={e => this.updateInvoice('payment_terms', e.target.value)}
                                    />
                                </div>
                                <div className="right_align_input_group">
                                    <EditableLabel 
                                        text={this.state.invoice.due_date_title}
                                        labelClassName='inline_label width_200 right_text'
                                        inputClassName='inline_input width_200 right_text'
                                        onFocusOut={value => this.updateInvoice('due_date_title', value)}
                                    />
                                    <DatePicker 
                                        className="form-control"
                                        dateFormat="LL"
                                        selected={moment(this.state.invoice.due_date, "LL")}
                                        onChange={value => this.updateInvoice('due_date', value.format("LL"))}
                                    />
                                </div>
                                <div className="balance_due_w">
                                    <EditableLabel 
                                        text={this.state.invoice.balance_title}
                                        labelClassName='inline_label width_200 right_text balance_due'
                                        inputClassName='inline_input width_200 right_text balance_due'
                                        onFocusOut={value => this.updateInvoice('balance_title', value)}
                                    />  {this.state.currency_sign} {calc_balanceDue(this.state.invoice)}
                                </div>
                            </div>
                        </div>
                        <div className="table_w">
                            <div className="table_header">
                                <div style={{width: 550}}>
                                    <EditableLabel
                                        text={this.state.invoice.item_header}
                                        labelClassName='inline_label_header width_200'
                                        inputClassName='inline_input_header width_200'
                                        onFocusOut={value => this.updateInvoice('item_header', value)}
                                    />
                                </div>
                                <div style={{width: 100}}>
                                    <EditableLabel
                                        text={this.state.invoice.quantity_header}
                                        labelClassName='inline_label_header width_100'
                                        inputClassName='inline_input_header width_100'
                                        onFocusOut={value => this.updateInvoice('quantity_header', value)}
                                    />
                                </div>
                                <div style={{width: 100}}>
                                    <EditableLabel
                                        text={this.state.invoice.unit_cost_header}
                                        labelClassName='inline_label_header width_100'
                                        inputClassName='inline_input_header width_100'
                                        onFocusOut={value => this.updateInvoice('unit_cost_header', value)}
                                    />
                                </div>
                                <div style={{width: 100}}>
                                    <EditableLabel
                                        text={this.state.invoice.amount_header}
                                        labelClassName='inline_label_header width_100'
                                        inputClassName='inline_input_header width_100'
                                        onFocusOut={value => this.updateInvoice('amount_header', value)}
                                    />
                                </div>
                            </div>
                            <div className="table_body">
                                {
                                    this.state.invoice.items.map((item, index)=>{
                                        return(
                                            <div className="table_row" key={index} >
                                                <Input 
                                                    className="table_item"
                                                    type="text"
                                                    placeholder="Description of Service or product..."
                                                    value={item.name}
                                                    onChange={e => this.updateItem(index, 'name', e.target.value)}
                                                />
                                                <Input 
                                                    className="table_quantity"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => this.updateItem(index, 'quantity', e.target.value)}
                                                />
                                                <Input 
                                                    className="table_rate"
                                                    type="number"
                                                    value={item.unit_cost}
                                                    onChange={e => this.updateItem(index, 'unit_cost', e.target.value)}
                                                />
                                                <div className="table_amount">
                                                    {this.state.currency_sign} {item.quantity * item.unit_cost}
                                                </div>
                                                {
                                                    this.state.invoice.items.length > 1?
                                                    <div className="remove_line" onClick={()=>this.removeItem(index)}>
                                                        &times;
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        )
                                    })
                                }
                                <hr/>
                                <Button
                                    color="primary"
                                    onClick={this.addItem.bind(this)}
                                >Add Item</Button>
                            </div>
                        </div>
                        <div className="sum_w">
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.subtotal_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('subtotal_title', value)}
                                />
                                <div style={{width: 200}}>{this.state.currency_sign} {calc_subTotal(this.state.invoice)}</div>
                            </div>
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.discounts_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('discounts_title', value)}
                                />
                                <Input 
                                    type="number"
                                    value={this.state.invoice.discounts}
                                    onChange={e => this.updateInvoice('discounts', e.target.value)}
                                />
                            </div>
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.tax_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('tax_title', value)}
                                />
                                <Input 
                                    type="number"
                                    value={this.state.invoice.tax}
                                    onChange={e => this.updateInvoice('tax', e.target.value)}
                                />
                            </div>
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.shipping_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('shipping_title', value)}
                                />
                                <Input 
                                    type="number"
                                    value={this.state.invoice.shipping}
                                    onChange={e => this.updateInvoice('shipping', e.target.value)}
                                />
                            </div>
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.total_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('total_title', value)}
                                />
                                <div style={{width: 200}}>{this.state.currency_sign} {calc_total(this.state.invoice)}</div>
                            </div>
                            <div className="right_align_input_group">
                                <EditableLabel 
                                    text={this.state.invoice.amount_paid_title}
                                    labelClassName='inline_label width_200 right_text'
                                    inputClassName='inline_input width_200 right_text'
                                    onFocusOut={value => this.updateInvoice('amount_paid_title', value)}
                                />
                                <Input 
                                    type="number"
                                    value={this.state.invoice.amount_paid}
                                    onChange={e => this.updateInvoice('amount_paid', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="footer_w">
                            <FormGroup>
                                <EditableLabel 
                                    text={this.state.invoice.notes_title}
                                    labelClassName='inline_label width_200'
                                    inputClassName='inline_input width_200'
                                    onFocusOut={value => this.updateInvoice('notes_title', value)}
                                />
                                <Input 
                                    type="textarea"
                                    placeholder="Notes - any relevant information not already covered"
                                    value={this.state.invoice.notes}
                                    onChange={e => this.updateInvoice('notes', e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <EditableLabel 
                                    text={this.state.invoice.terms_title}
                                    labelClassName='inline_label width_200'
                                    inputClassName='inline_input width_200'
                                    onFocusOut={value => this.updateInvoice('terms_title', value)}
                                />
                                <Input 
                                    type="textarea"
                                    placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                                    value={this.state.invoice.terms}
                                    onChange={e => this.updateInvoice('terms', e.target.value)}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
