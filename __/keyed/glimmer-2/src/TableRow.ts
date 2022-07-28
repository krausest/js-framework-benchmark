import { on } from '@glimmer/modifier';
import { precompileTemplate, setComponentTemplate, templateOnlyComponent } from '@glimmer/core';

export default setComponentTemplate(
  precompileTemplate(
    `<tr ...attributes><td class="col-md-1">{{@item.id}}</td><td class="col-md-4"><a {{on 'click' @onSelect}}>{{@item.label}}</a></td><td class="col-md-1"><a {{on 'click' @onRemove}}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`,
    {
      strictMode: true,
      scope: () => ({ on })
    }
  ),
  templateOnlyComponent()
);
