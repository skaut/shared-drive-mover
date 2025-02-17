<script lang="ts" strictEvents>
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  import * as m from "./paraglide/messages.js";
  import { _ } from "svelte-i18n";

  import StepHeader from "./StepHeader.svelte";

  export let copyComments: boolean;
  export let mergeFolders: boolean;
</script>

<StepHeader step="introduction" />
<p>
  {m.introduction_welcome()}
</p>
<h5>
  {$_("steps.introduction.configuration.header")}
</h5>
<FormField>
  <Checkbox bind:checked={copyComments} />
  <span slot="label">
    <div class="form-heading">
      {$_("steps.introduction.configuration.copyComments.title")}
    </div>
    {$_("steps.introduction.configuration.copyComments.description")}
  </span>
</FormField>
<br />
<br />
<FormField>
  <Checkbox bind:checked={mergeFolders} />
  <span slot="label">
    <div class="form-heading">
      {$_("steps.introduction.configuration.mergeFolders.title")}
    </div>
    {$_("steps.introduction.configuration.mergeFolders.description")}
  </span>
</FormField>
<br />
<br />

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h5 {
    @include mdc-typography("headline5");
  }

  .form-heading {
    @include mdc-typography("subtitle2");
  }
</style>
