<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";

  import * as m from "./paraglide/messages";

  interface Props {
    disabled: boolean;
    onclick(this: void): void;
  }

  const { disabled, onclick }: Props = $props();
</script>

<Button {disabled} {onclick} variant="raised">
  <Label>{m.continue_buttonLabel()}</Label>
  <Icon class="material-icons">navigate_next</Icon>
</Button>
