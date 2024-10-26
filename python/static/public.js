var phoneTest = function(No) {
    var reg = /^1[3456789]\d{9}$/;
    return reg['test'](No);
};
var emailTest = function(pw) {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg['test'](pw);
};
var userpasswordTest = function(pw) {
    var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    return reg['test'](pw);
};
var spaceTest = function(str) {
    var reg = /^\s*$/;
    return reg['test'](str);
};
var emailTest = function(EMail) {
    var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    return reg['test'](EMail);
};
var strTest = function(v) {
    var reg = new RegExp("[`~!@%#$^&*()=|{}':;',\\[\\]<>/?\\.；：%……+￥‘”“'。，？]");
    return reg.test(v);
};
var codeTest = function(v) {
    var reg = /^([A-Za-z0-9]+){6,10}$/;
    return reg['test'](v);
};
var domainTest = function(v) {
    var reg = /^([a-z0-9]+){1,16}$/;
    return reg['test'](v);
};
var numberTest = function(v) {
    var reg = /^([0-9]+){1,24}$/;
    return reg['test'](v);
};


function AjaxFn(url, data, callbackFn) {
    var data2=data
    data2.token=localStorage.getItem('token')||'';
    $.ajax({
        'url': apihost + url,
        'type': 'POST',
        'data': data2,
        'error': function(err) {},
        'success': function(res) {
            callbackFn(res);
        }
    });
}

