import Vue from 'vue'
//引入element-ui
import {
    Form,
    Input,
    FormItem,
    Button,
    Message,
    Container,
    Aside,
    Header,
    Main,
    Submenu,
    MenuItem,
    Menu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Select,
    Option,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload
    } from 'element-ui';
//树形table插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
//富文本编辑器插件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.component(Form.name,Form);
Vue.component(Input.name,Input);
Vue.component(FormItem.name,FormItem);
Vue.use(Button);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Header);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Menu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Upload);
//消息弹框
Vue.prototype.$message=Message;
Vue.prototype.$confirm=MessageBox.confirm