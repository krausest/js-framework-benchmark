import { precompileTemplate, setComponentTemplate, templateOnlyComponent } from '@glimmer/core';

import MyTable from './MyTable';

export default setComponentTemplate(
  precompileTemplate(`<div class="container"><MyTable /></div>`,  { scope: () => ({ MyTable }), strictMode: true }),
  templateOnlyComponent()
);
