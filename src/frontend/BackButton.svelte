<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  import * as m from "./paraglide/messages";

  const dispatch = createEventDispatcher<{ previous: null }>();
</script>

<br />
<Button
  onclick={(): void => {
    dispatch("previous");
  }}
  variant="outlined"
>
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{m.back_buttonLabel()}</Label>
</Button>
