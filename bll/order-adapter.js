#!/usr/bin/env node
"strict mode";
"esversion:6";

let enumTypes = require('../enum-types');

/******---------------------------------------------- BEGIN OF ADAPTER METHODS --------------------------------------------------------------------------------------***/

module.exports.getOrderInvoice = (data) => {
    try {
        let totalAmountWithTax = 0, arr = [];
        data.forEach(x => {
            switch(x.itemCategory){
                case "Medicine":
                    {
                        x.tax_detail = _calulateTax(x, enumTypes.categoriesTax.MEDICINES);
                        break;
                    }  
                case "Food":
                    {
                        x.tax_detail = _calulateTax(x, enumTypes.categoriesTax.FOOD);
                        break;
                    } 
                case "Clothes":
                    {
                        let _category = (x.price < 1000) ?  enumTypes.categoriesTax.CLOTHES_MIN : enumTypes.categoriesTax.CLOTHES_MAX;
                        x.tax_detail = _calulateTax(x, _category);
                        break;
                    }     
                case "Clothes":
                    {
                        let _category = (x.price < 1000) ?  enumTypes.categoriesTax.CLOTHES_MIN : enumTypes.categoriesTax.CLOTHES_MAX;
                        x.tax_detail = _calulateTax(x, _category);
                        break;
                    }  
                case "CD":
                case "DVD":
                    {
                        x.tax_detail = _calulateTax(x, enumTypes.categoriesTax.CD_DVD);
                        break;
                    }  
                case "Imported":
                    {
                        x.tax_detail = _calulateTax(x, enumTypes.categoriesTax.IMPORTED);
                        break;
                    } 
                default :
                    {
                        x.tax_detail = _calulateTax(x, enumTypes.categoriesTax.DEFAULT);
                        break;
                    }    
            }

            x.price_with_tax = x.price + x.tax_detail.tax_total;
            totalAmountWithTax += x.price_with_tax;
            arr.push(x);
        });
        return {order_detail: arr, total_amount: totalAmountWithTax};
    }
    catch(ex){throw ex}
}

/******---------------------------------------------- END OF ADAPTER METHODS ----------------------------------------------------------------------------------------***/
/******---------------------------------------------- BEGIN OF INNER METHODS ----------------------------------------------------------------------------------------***/

let _calulateTax = (data, taxPercentage)=>{
    try{
        let tax_detail = {};
        tax_detail.percent = taxPercentage;
        tax_detail.tax_per_item = parseFloat(((taxPercentage/100) * data.price).toFixed(2));
        tax_detail.tax_total = parseFloat((tax_detail.tax_per_item * data.quantity).toFixed(2));
        return tax_detail;
    }
    catch(ex){ throw ex;}
}

/******---------------------------------------------- END OF INNER METHODS ----------------------------------------------------------------------------------------***/