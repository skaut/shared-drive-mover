<script lang="ts" strictEvents>
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  import * as m from "./paraglide/messages";

  const dispatch = createEventDispatcher<{ previous: null }>();
</script>

<br />
<Button variant="outlined" on:click={() => dispatch("previous")}>
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{m.back_buttonLabel()}</Label>
</Button>
