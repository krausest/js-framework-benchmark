import { state } from './state.js';

export const TheTable = <template>
  <table class="table table-hover table-striped test-data">
    <tbody>
      {{#each state.data as |row|}}
        <tr class={{if row.selected.value "danger"}}><td
            class="col-md-1"
          >{{row.id}}</td><td class="col-md-4"><a
              onclick={{fn state.select row.id}}
            >{{row.label.value}}</a></td><td class="col-md-1"><a
              onclick={{fn state.remove row.id}}
            ><span
                class="glyphicon glyphicon-remove"
                aria-hidden="true"
              /></a></td><td class="col-md-6" />
        </tr>
      {{/each}}
    </tbody>
  </table>
</template>;
