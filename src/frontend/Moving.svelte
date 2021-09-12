<p>
  {$_("steps.moving.introduction")}
</p>
<Dialog bind:open={dialogOpen} aria-labelledby="title" aria-describedby="content">
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

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import Button, {Label} from "@smui/button/styled";
  import Dialog, {Actions, Content, Title} from "@smui/dialog/styled";

  export function showNonEmptyDialog() {
    dialogOpen = true;
  }

  const dispatch = createEventDispatcher();

  let dialogOpen;
</script>
