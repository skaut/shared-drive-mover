<script lang="ts" strictEvents>
  interface $$Slots {
    default: Record<string, never>;
  }
</script>

<h2>
  <slot />
</h2>

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h2 {
    @include mdc-typography("headline2");
  }
</style>
