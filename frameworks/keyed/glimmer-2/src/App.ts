import { createTemplate, setComponentTemplate, templateOnlyComponent } from '@glimmer/core';

import MyTable from './MyTable';

export default setComponentTemplate(
  createTemplate({ MyTable }, `<div class="container"><MyTable /></div>`),
  templateOnlyComponent()
);
