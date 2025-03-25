<script lang="ts">
  import type { Snippet } from "svelte";

  import Button, { Icon, Label } from "@smui/button";

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();

  let open = $state(false);
</script>

<Button
  onclick={(): void => {
    open = !open;
  }}
>
  <Icon class="material-icons">
    {#if open}
      expand_more
    {:else}
      chevron_right
    {/if}
  </Icon>
  <Label>Details</Label>
</Button>
<br />
{#if open}
  {@render children()}
{/if}
