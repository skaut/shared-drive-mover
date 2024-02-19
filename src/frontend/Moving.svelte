<script lang="ts" strictEvents>
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";

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
  {$_("steps.moving.introduction")}
</p>
<Dialog
  aria-describedby="content"
  aria-labelledby="title"
  bind:open={nonEmptyDialogOpen}
>
  <Title id="title">
    {$_("steps.moving.nonEmptyDialog.title")}
  </Title>
  <Content id="content">
    {$_("steps.moving.nonEmptyDialog.content")}
  </Content>
  <Actions>
    <Button on:click={() => dispatch("nonEmptyDialogCancel")}>
      <Label>
        {$_("steps.moving.nonEmptyDialog.cancel")}
      </Label>
    </Button>
    <Button on:click={() => dispatch("nonEmptyDialogConfirm")}>
      <Label>
        {$_("steps.moving.nonEmptyDialog.confirm")}
      </Label>
    </Button>
  </Actions>
</Dialog>
