<StepHeader step="done"/>
<p>
  {$_("steps.done.introduction")}
</p>
{#if errors !== null && errors.length > 0}
  <p class="mdc-typography--subtitle2">
    {@html $_("steps.done.errors.introduction", {values: {link: '<a href="https://github.com/skaut/shared-drive-mover/issues" target="_blank">' + $_("steps.done.errors.github") + "</a>"}})}
  </p>
  <DataTable>
    <DataTableHead>
      <DataTableRow>
        <DataTableCell>
          {$_("steps.done.errors.file")}
        </DataTableCell>
        <DataTableCell>
          {$_("steps.done.errors.message")}
        </DataTableCell>
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      {#each errors as error}
        <DataTableRow>
          <DataTableCell>
            {error.file.join("/")}
          </DataTableCell>
          <DataTableCell>
            {error.error}
          </DataTableCell>
        </DataTableRow>
      {/each}
    </DataTableBody>
  </DataTable>
{/if}

<script lang="ts">
  import {_} from "svelte-i18n";
  import {DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableCell} from 'svelte-materialify/src';

  import StepHeader from "./StepHeader.svelte";

  export let errors: Array<MoveError>|null = [];
</script>
