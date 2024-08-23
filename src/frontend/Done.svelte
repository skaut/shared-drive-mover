<script lang="ts" strictEvents>
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import { _ } from "svelte-i18n";

  import type { MoveError } from "../interfaces/MoveError";

  import StepHeader from "./StepHeader.svelte";

  export let errors: Array<MoveError> | null = [];
</script>

<StepHeader step="done" />
<p>
  {$_("steps.done.introduction")}
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
          {$_("steps.done.errors.file")}
        </Cell>
        <Cell>
          {$_("steps.done.errors.message")}
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
