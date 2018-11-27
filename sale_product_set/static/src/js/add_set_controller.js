odoo.define('sale_product_set.AddProductSetFormController', function (require) {
"use strict";

var core = require('web.core');
var _t = core._t;
var FormController = require('web.FormController');
var ProductConfiguratorFormController = require('sale.ProductConfiguratorFormController')
var AddProductSetFormController = FormController.extend({
    className: 'o_product_set',

    init: function (){
    console.log('init');
        this._super.apply(this, arguments);
    },
    _onButtonClicked: function (event) {
        if (event.stopPropagation){
            event.stopPropagation();
        }
        var attrs = event.data.attrs;
        if (attrs.special === 'cancel') {
            this._super.apply(this, arguments);
        } else {
            this._handleAdd(this.$el);
        }
    },
     _handleAdd: function ($modal) {

        var self = this;
        self._rpc({
            model: 'product.set.add',
            method: 'prepare_sale_order_line_data',
            kwargs: {set_id: 1},
        }).then(function (products) {
        console.log(products);
            self.addProducts(products);
        });

    },
    addProducts: function (products) {
    console.log(products);
        this.do_action({type: 'ir.actions.act_window_close', infos: products});
    }
});

return AddProductSetFormController;

});

odoo.define('sale_product_set.AddProductSetFormView', function (require) {
"use strict";

var AddProductSetFormController = require('sale_product_set.AddProductSetFormController');
var FormView = require('web.FormView');
var viewRegistry = require('web.view_registry');

var AddProductSetFormView = FormView.extend({
    config: _.extend({}, FormView.prototype.config, {
        Controller: AddProductSetFormController,
    }),
});

viewRegistry.add('add_product_set_form', AddProductSetFormView);

return AddProductSetFormView;

});