<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import Button, { Icon, Label } from "@smui/button";

  import BackButton from "./BackButton.svelte";
  import StepHeader from "./StepHeader.svelte";

  import type { NamedRecord } from "../interfaces/NamedRecord";

  export let sourcePath: Array<NamedRecord> = [];
  export let destinationPath: Array<NamedRecord> = [];
  export let source: NamedRecord | null;
  export let destination: NamedRecord | null;

  const dispatch = createEventDispatcher();

  $: sourceDisplay =
    sourcePath.map((segment) => segment.name + "/").join("") + source?.name;
  $: destinationDisplay =
    destinationPath.map((segment) => segment.name + "/").join("") +
    destination?.name;
</script>

<StepHeader step="confirmation" />
<p>
  {$_("steps.confirmation.introduction", {
    values: { source: sourceDisplay, destination: destinationDisplay },
  })}
</p>
<BackButton on:previous={() => dispatch("previous")} />
<Button variant="raised" on:click={() => dispatch("next")}>
  <Label>{$_("steps.confirmation.buttonLabel")}</Label>
  <Icon class="material-icons">cloud_done</Icon>
</Button>
