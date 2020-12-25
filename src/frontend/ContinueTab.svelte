<slot/>
<br/>
<Button variant="raised" on:click={dispatch("next")}>
  <Label>continue.text</Label>
  <Icon class="material-icons">favorite</Icon>
</Button>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button, {Icon, Label} from "@smui/button"

  const dispatch = createEventDispatcher();
</script>
