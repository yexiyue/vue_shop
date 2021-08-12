import Vue from 'vue'
//引入element-ui
import {Form,Input,FormItem} from 'element-ui';
import {Button} from 'element-ui'
Vue.component(Form.name,Form);
Vue.component(Input.name,Input);
Vue.component(FormItem.name,FormItem);
Vue.use(Button);