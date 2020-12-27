<p>
  {$_("steps.confirmation.introduction", {values: { source: sourceDisplay, destination: destinationDisplay }})}
</p>
<Button variant="raised" on:click={() => dispatch("next")}>
  <Label>{$_("steps.confirmation.buttonLabel")}</Label>
  <Icon class="material-icons">cloud_done</Icon>
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import Button, {Icon, Label} from "@smui/button";

  export let sourcePath: Array<NamedRecord> = [];
  export let destinationPath: Array<NamedRecord> = [];
  export let source: NamedRecord|null;
  export let destination: NamedRecord|null;

  const dispatch = createEventDispatcher();

  $: sourceDisplay = sourcePath.map((segment) => segment.name + "/").join("") + source?.name;
  $: destinationDisplay = destinationPath.map((segment) => segment.name + "/").join("") + destination?.name;
</script>
