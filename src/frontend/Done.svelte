<script lang="ts" strictEvents>
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import { _ } from "svelte-i18n";

  import type { MoveError } from "../interfaces/MoveError";

  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  export let errors: Array<MoveError> | null = [];
</script>

<StepHeader>
  {m.done_header()}
</StepHeader>
<p>
  {m.done_introduction()}
</p>
{#if errors !== null && errors.length > 0}
  <p class="mdc-typography--subtitle2">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html $_("steps.done.errors.introduction", {
      values: {
        link: `<a href="https://github.com/skaut/shared-drive-mover/issues" target="_blank">${$_("steps.done.errors.github")}</a>`,
      },
    })}
  </p>
  <DataTable>
    <Head>
      <Row>
        <Cell>
          {m.done_errors_file()}
        </Cell>
        <Cell>
          {m.done_errors_message()}
        </Cell>
      </Row>
    </Head>
    <Body>
      {#each errors as error (error)}
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

<style lang="scss">
  @import "@material/typography/mdc-typography";
</style>
