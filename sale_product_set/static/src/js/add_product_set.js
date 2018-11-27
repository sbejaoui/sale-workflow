odoo.define('sale_product_set.AddProductSet', function (require) {
    "use strict";
    var pyUtils = require('web.py_utils');
    var core = require('web.core');
    var _t = core._t;
    var fieldRegistry = require('web.field_registry');
    var SectionAndNoteFieldOne2Many = fieldRegistry.get('section_and_note_one2many');
    var SectionAndNoteFieldOne2Many2 = SectionAndNoteFieldOne2Many.extend({
        _getRenderer: function () {
            var res = this._super.apply(this, arguments);
            if (this.view.arch.tag === 'tree') {
                var SectionAndNoteListRenderer = res;
                SectionAndNoteListRenderer.include({
                    _getOrderID: function () {
                        var saleOrderForm = this.getParent() && this.getParent().getParent();
                        var stateData = saleOrderForm && saleOrderForm.state && saleOrderForm.state.data;
                        var pricelist_id = stateData.pricelist_id && stateData.pricelist_id.data && stateData.pricelist_id.data.id;

                        return pricelist_id;
                    },
                    _onAddRecord: function (ev) {
                        var context = ev.currentTarget.dataset.context;
                        var self = this;
                        if (context && pyUtils.py_eval(context).add_product_set){
                        console.log(context);
                            ev.preventDefault();
                            ev.stopPropagation();
                            this.unselectRow().then(function () {
                                self._rpc({
                                        model: 'ir.model.data',
                                        method: 'xmlid_to_res_id',
                                        kwargs: {xmlid: 'sale_product_set.product_set_add_form_view'},
                                    }).then(function (res_id) {
                                        self.do_action({
                                            name: _t('Add set in sale order line'),
                                            type: 'ir.actions.act_window',
                                            res_model: 'product.set.add',
                                            views: [[res_id, 'form']],
                                            target: 'new',
                                        });
                                    },{
                                        on_close: function (products) {
                                            if (products && products !== 'special'){
                                                self.trigger_up('add_record', {
                                                    context: self._productsToRecords(products),
                                                    forceEditable: "bottom" ,
                                                    allowWarning: true,
                                                    onSuccess: function (){
                                                        self.unselectRow();
                                                    }
                                                });
                                            }
                                        }
                                    });
                            });
                        }else{
                            this._super.apply(this, arguments);
                        }

                    },
                });
                return SectionAndNoteListRenderer
            }
            return res;
        },
    });
    fieldRegistry.add('section_and_note_one2many', SectionAndNoteFieldOne2Many2);
});