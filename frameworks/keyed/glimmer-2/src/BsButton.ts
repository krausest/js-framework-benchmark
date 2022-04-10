import { precompileTemplate, setComponentTemplate, templateOnlyComponent } from '@glimmer/core';

export default setComponentTemplate(
  precompileTemplate(`<button type="button" class="btn btn-primary btn-block" ...attributes>{{yield}}</button>`,  { strictMode: true }),
  templateOnlyComponent()
);
