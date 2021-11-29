<StepHeader step="done"/>
<p>
  {$_("steps.done.introduction")}
</p>
{#if errors !== null && errors.length > 0}
  <p class="mdc-typography--subtitle2">
    {@html $_("steps.done.errors.introduction", {values: {link: '<a href="https://github.com/skaut/shared-drive-mover/issues" target="_blank">' + $_("steps.done.errors.github") + "</a>"}})}
  </p>
  <DataTable>
    <Head>
      <Row>
        <Cell>
          {$_("steps.done.errors.file")}
        </Cell>
        <Cell>
          {$_("steps.done.errors.message")}
        </Cell>
      </Row>
    </Head>
    <Body>
      {#each errors as error}
        <Row>
          <Cell>
            {error.file.join("/")}
          </Cell>
          <Cell>
            {error.error}
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
{/if}

<script lang="ts">
  import {_} from "svelte-i18n";
  import DataTable, {Body, Cell, Head, Row} from "@smui/data-table/styled"

  import StepHeader from "./StepHeader.svelte";

  import type { MoveError } from "../interfaces/MoveError";

  export let errors: Array<MoveError>|null = [];
</script>

<style lang="scss">
  @import "@material/typography/mdc-typography";
</style>
