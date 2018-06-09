// Precompiled underscore template
export default function(obj){
  var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
  __p+='<td class="col-md-1">'+
    ((__t=( obj.id ))==null?'':__t)+
    '</td><td class="col-md-4"><a class="js-link">'+
      ((__t=( obj.label ))==null?'':__t)+
      '</a></td><td class="col-md-1"><a class="js-del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td>';
  return __p;
};