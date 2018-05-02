
export const calc_subTotal = (invoice)=>{
    let price = 0;
    invoice.items.map(item=>{
        price += Number(item.quantity) * Number(item.unit_cost);
    })
    return financial(price);
}

export const calc_total = (invoice)=>{
    let total = calc_subTotal(invoice);
    let discounts = (total * Number(invoice.discounts) / 100);
    let discounted = total - (discounts);
    let tax = (discounted * Number(invoice.tax) / 100);
    let taxed = discounted + tax
    total = taxed + Number(invoice.shipping);
    return financial(total);
}

export const calc_balanceDue = (invoice)=>{
    let balanceDue = calc_total(invoice);
    balanceDue = balanceDue - Number(invoice.amount_paid);
    return financial(balanceDue);
}

export const financial = (x)=>{
    return Number(Number.parseFloat(x).toFixed(2));
}