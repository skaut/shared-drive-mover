<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<h2>
  {@render children()}
</h2>

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h2 {
    @include mdc-typography("headline2");
  }
</style>
