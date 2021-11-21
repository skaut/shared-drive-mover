<br/>
<Button variant="outlined" on:click={() => dispatch("previous")}>
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{$_("back.buttonLabel")}</Label>
</Button>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import Button, {Icon, Label} from "@smui/button/styled";

  const dispatch = createEventDispatcher();
</script>
