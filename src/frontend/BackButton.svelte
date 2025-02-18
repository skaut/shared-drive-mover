<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";

  import * as m from "./paraglide/messages";

  interface Props {
    onclick(this: void): void;
  }

  const { onclick }: Props = $props();
</script>

<br />
<Button {onclick} variant="outlined">
  <Icon class="material-icons">navigate_before</Icon>
  <Label>{m.back_buttonLabel()}</Label>
</Button>
