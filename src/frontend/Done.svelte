<script lang="ts">
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";

  import type { MoveError } from "../interfaces/MoveError";

  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  interface Props {
    errors?: Array<MoveError> | null;
  }

  const { errors = [] }: Props = $props();
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
    {@html m.done_errors_introduction({
      link: `<a href="https://github.com/skaut/shared-drive-mover/issues" target="_blank">${m.done_errors_github()}</a>`,
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
