<Button class="primary-color" {disabled} on:click={() => dispatch("next")}>
  {$_("continue.buttonLabel")}
  <Icon path={mdiChevronRight} />
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import {Button, Icon} from 'svelte-materialify/src';
  import {mdiChevronRight} from '@mdi/js';

  export let disabled: boolean;

  const dispatch = createEventDispatcher();
</script>
