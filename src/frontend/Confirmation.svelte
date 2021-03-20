<StepHeader step="confirmation"/>
<p>
  {$_("steps.confirmation.introduction", {values: { source: sourceDisplay, destination: destinationDisplay }})}
</p>
<BackButton on:previous={() => dispatch("previous")}/>
<Button class="primary-color" on:click={() => dispatch("next")}>
  {$_("steps.confirmation.buttonLabel")}
  <Icon path={mdiCloudCheck} />
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import {Button, Icon} from 'svelte-materialify/src';
  import {mdiCloudCheck} from "@mdi/js";

  import BackButton from "./BackButton.svelte";
  import StepHeader from "./StepHeader.svelte";

  export let sourcePath: Array<NamedRecord> = [];
  export let destinationPath: Array<NamedRecord> = [];
  export let source: NamedRecord|null;
  export let destination: NamedRecord|null;

  const dispatch = createEventDispatcher();

  $: sourceDisplay = sourcePath.map((segment) => segment.name + "/").join("") + source?.name;
  $: destinationDisplay = destinationPath.map((segment) => segment.name + "/").join("") + destination?.name;
</script>
