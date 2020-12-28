<br/>
<br/>
<Button variant="raised" {disabled} on:click={() => dispatch("next")}>
  <Label>{$_("continue.buttonLabel")}</Label>
  <Icon class="material-icons">navigate_next</Icon>
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import Button, {Icon, Label} from "@smui/button";

  export let disabled: boolean;

  const dispatch = createEventDispatcher();
</script>
