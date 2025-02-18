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
  @use "@material/typography/mixins" as typography;

  h2 {
    @include typography.typography("headline2");
  }
</style>
