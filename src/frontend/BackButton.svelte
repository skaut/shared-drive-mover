<br/>
<Button variant="raised" on:click={() => dispatch("previous")}>
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{$_("back.buttonLabel")}</Label>
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import Button, {Icon, Label} from "@smui/button";

  const dispatch = createEventDispatcher();
</script>
