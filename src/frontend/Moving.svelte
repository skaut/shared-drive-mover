<p>
  {$_("steps.moving.introduction")}
</p>
<Dialog persistent bind:active={nonEmptyDialogOpen}>
  <Card>
    <CardTitle>
      {$_("steps.moving.nonEmptyDialog.title")}
    </CardTitle>
    <CardText>
      {$_("steps.moving.nonEmptyDialog.content")}
    </CardText>
    <CardActions class="justify-end">
      <Button text class="primary-text" on:click={dialogCancel}>
        {$_("steps.moving.nonEmptyDialog.cancel")}
      </Button>
      <Button text class="primary-text" on:click={dialogConfirm}>
        {$_("steps.moving.nonEmptyDialog.confirm")}
      </Button>
    </CardActions>
  </Card>
</Dialog>

<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {_} from "svelte-i18n";
  import {Button, Card, CardActions, CardText, CardTitle, Dialog} from 'svelte-materialify/src';

  let nonEmptyDialogOpen = false;
  export function showNonEmptyDialog() {
    nonEmptyDialogOpen = true;
  }

  const dispatch = createEventDispatcher();

  function dialogCancel() {
    nonEmptyDialogOpen = false;
    dispatch("nonEmptyDialogCancel");
  }

  function dialogConfirm() {
    nonEmptyDialogOpen = false;
    dispatch("nonEmptyDialogConfirm");
  }
</script>
