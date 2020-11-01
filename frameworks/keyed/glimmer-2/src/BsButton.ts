import { createTemplate, setComponentTemplate, templateOnlyComponent } from '@glimmer/core';

export default setComponentTemplate(
  createTemplate(`<button type="button" class="btn btn-primary btn-block" ...attributes>{{yield}}</button>`),
  templateOnlyComponent()
);
