<script lang="ts" strictEvents>
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import { createEventDispatcher } from "svelte";

  import * as m from "./paraglide/messages";

  let nonEmptyDialogOpen: boolean;

  export function showNonEmptyDialog(): void {
    nonEmptyDialogOpen = true;
  }

  const dispatch = createEventDispatcher<{
    nonEmptyDialogCancel: null;
    nonEmptyDialogConfirm: null;
  }>();
</script>

<p>
  {m.moving_introduction()}
</p>
<Dialog
  aria-describedby="content"
  aria-labelledby="title"
  bind:open={nonEmptyDialogOpen}
>
  <Title id="title">
    {m.moving_nonEmptyDialog_title()}
  </Title>
  <Content id="content">
    {m.moving_nonEmptyDialog_content()}
  </Content>
  <Actions>
    <Button on:click={() => dispatch("nonEmptyDialogCancel")}>
      <Label>
        {m.moving_nonEmptyDialog_cancel()}
      </Label>
    </Button>
    <Button on:click={() => dispatch("nonEmptyDialogConfirm")}>
      <Label>
        {m.moving_nonEmptyDialog_confirm()}
      </Label>
    </Button>
  </Actions>
</Dialog>
