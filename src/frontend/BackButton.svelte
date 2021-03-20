<br/>
<Button on:click={() => dispatch("previous")}>
  <Icon path={mdiChevronLeft} />
  {$_("back.buttonLabel")}
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import {Button, Icon} from 'svelte-materialify/src';
  import {mdiChevronLeft} from '@mdi/js';

  const dispatch = createEventDispatcher();
</script>
