<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  export let disabled: boolean;

  const dispatch = createEventDispatcher();
</script>

<Button {disabled} variant="raised" on:click={() => dispatch("next")}>
  <Label>{$_("continue.buttonLabel")}</Label>
  <Icon class="material-icons">navigate_next</Icon>
</Button>
