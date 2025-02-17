<script lang="ts" strictEvents>
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  import type { NamedRecord } from "../interfaces/NamedRecord";

  import BackButton from "./BackButton.svelte";
  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  export let sourcePath: Array<NamedRecord> = [];
  export let destinationPath: Array<NamedRecord> = [];
  export let source: NamedRecord | null;
  export let destination: NamedRecord | null;

  const dispatch = createEventDispatcher<{ next: null; previous: null }>();

  $: sourceDisplay =
    sourcePath.map((segment) => `${segment.name}/`).join("") +
    (source?.name ?? "");
  $: destinationDisplay =
    destinationPath.map((segment) => `${segment.name}/`).join("") +
    (destination?.name ?? "");
</script>

<StepHeader>
  {m.confirmation_header()}
</StepHeader>
<p>
  {m.confirmation_introduction({
    destination: destinationDisplay,
    source: sourceDisplay,
  })}
</p>
<BackButton on:previous={() => dispatch("previous")} />
<Button variant="raised" on:click={() => dispatch("next")}>
  <Label>{m.confirmation_buttonLabel()}</Label>
  <Icon class="material-icons">cloud_done</Icon>
</Button>
