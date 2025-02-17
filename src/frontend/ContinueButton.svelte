<script lang="ts" strictEvents>
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  import * as m from "./paraglide/messages";

  export let disabled: boolean;

  const dispatch = createEventDispatcher<{ next: null }>();
</script>

<Button {disabled} variant="raised" on:click={() => dispatch("next")}>
  <Label>{m.continue_buttonLabel()}</Label>
  <Icon class="material-icons">navigate_next</Icon>
</Button>
