<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";

  import type { NamedRecord } from "../interfaces/NamedRecord";

  import BackButton from "./BackButton.svelte";
  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  interface Props {
    destination: NamedRecord | null;
    destinationPath?: Array<NamedRecord>;
    onnext(this: void): void;
    onprevious(this: void): void;
    source: NamedRecord | null;
    sourcePath?: Array<NamedRecord>;
  }
  const {
    destination,
    destinationPath = [],
    onnext,
    onprevious,
    source,
    sourcePath = [],
  }: Props = $props();

  let sourceDisplay = $derived(
    sourcePath.map((segment) => `${segment.name}/`).join("") +
      (source?.name ?? ""),
  );
  let destinationDisplay = $derived(
    destinationPath.map((segment) => `${segment.name}/`).join("") +
      (destination?.name ?? ""),
  );
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
<BackButton onclick={onprevious} />
<Button onclick={onnext} variant="raised">
  <Label>{m.confirmation_buttonLabel()}</Label>
  <Icon class="material-icons">cloud_done</Icon>
</Button>
