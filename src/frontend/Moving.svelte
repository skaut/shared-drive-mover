<script lang="ts">
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";

  import * as m from "./paraglide/messages";

  interface Props {
    onNonEmptyDialogCancel(this: void): void;
    onNonEmptyDialogConfirm(this: void): void;
  }

  const { onNonEmptyDialogCancel, onNonEmptyDialogConfirm }: Props = $props();

  let nonEmptyDialogOpen = $state(false);

  export function showNonEmptyDialog(): void {
    nonEmptyDialogOpen = true;
  }
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
    <Button onclick={onNonEmptyDialogCancel}>
      <Label>
        {m.moving_nonEmptyDialog_cancel()}
      </Label>
    </Button>
    <Button onclick={onNonEmptyDialogConfirm}>
      <Label>
        {m.moving_nonEmptyDialog_confirm()}
      </Label>
    </Button>
  </Actions>
</Dialog>
