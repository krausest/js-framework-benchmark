export default function(data) {
    return `<td class="col-md-1">${data.id}</td><td class="col-md-4"><a class="js-link">${data.label}</a></td><td class="col-md-1"><a class="js-del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td>`;
}
