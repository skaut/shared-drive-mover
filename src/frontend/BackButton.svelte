<script lang="ts" strictEvents>
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

  const dispatch = createEventDispatcher();
</script>

<br />
<Button variant="outlined" on:click={() => dispatch("previous")}>
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{$_("back.buttonLabel")}</Label>
</Button>
