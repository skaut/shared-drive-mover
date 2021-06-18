<h2>
  {$_("steps." + step + ".header")}
</h2>

<script lang="ts">
  import {_} from "svelte-i18n";

  export let step: string;
</script>

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h2 {
    @include mdc-typography('headline2');
  }
</style>
