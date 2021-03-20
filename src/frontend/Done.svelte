<StepHeader step="done"/>
<p>
  {$_("steps.done.introduction")}
</p>
{#if errors !== null && errors.length > 0}
  <p class="mdc-typography--subtitle2">
    {@html $_("steps.done.errors.introduction", {values: {link: '<a href="https://github.com/skaut/shared-drive-mover/issues" target="_blank">' + $_("steps.done.errors.github") + "</a>"}})}
  </p>
  <!--Table> TODO: Add table
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
  </Table-->
{/if}

<script lang="ts">
  import {_} from "svelte-i18n";
  //import {Table} from 'svelte-materialify/src';

  import StepHeader from "./StepHeader.svelte";

  export let errors: Array<MoveError>|null = [];
</script>
