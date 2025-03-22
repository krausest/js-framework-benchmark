export default class DooConfig {
    static DATA_BIND ='bind'
    static TEMPLATE_EXT = '.html'
    static COMPONENT_DIR = '/components'
    static NAME ='DooHTML'
    static TYPE = {DEFAULT:0,ENUM:1,DEEP:2,COMPUTED:3 }
    static MATCH = {ANY:-1,STARTS_WITH:0,EXACT:1}
    static DELIMITER = {'BEG':'{{','END':'}}'}
    static DOCUMENT =  'document'
    static PAGE_SIZE = 12
    static DATA_STORE='data-store'
    static DATA_KEY='data-key'
}
