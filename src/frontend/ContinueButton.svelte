<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  import * as m from "./paraglide/messages";

  interface Props {
    disabled: boolean;
  }

  const { disabled }: Props = $props();

  const dispatch = createEventDispatcher<{ next: null }>();
</script>

<Button
  {disabled}
  onclick={(): void => {
    dispatch("next");
  }}
  variant="raised"
>
  <Label>{m.continue_buttonLabel()}</Label>
  <Icon class="material-icons">navigate_next</Icon>
</Button>
