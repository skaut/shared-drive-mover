<StepHeader step="introduction"/>
<p>
  {$_("steps.introduction.welcome")}
</p>
<h5>
  {$_("steps.introduction.configuration.header")}
</h5>
<FormField>
  <Checkbox bind:checked={copyComments}/>
  <span slot="label">
    <div class="form-heading">
      {$_("steps.introduction.configuration.copyComments.title")}
    </div>
    {$_("steps.introduction.configuration.copyComments.description")}
  </span>
</FormField>
<br/>
<br/>
<FormField>
  <Checkbox bind:checked={mergeFolders}/>
  <span slot="label">
    <div class="form-heading">
      {$_("steps.introduction.configuration.mergeFolders.title")}
    </div>
    {$_("steps.introduction.configuration.mergeFolders.description")}
  </span>
</FormField>
<br/>
<br/>

<script lang="ts">
  import {_} from "svelte-i18n";
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  import StepHeader from "./StepHeader.svelte";

  export let copyComments: boolean;
  export let mergeFolders: boolean;
</script>

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h5 {
    @include mdc-typography('headline5');
  }

  .form-heading {
    @include mdc-typography('subtitle2');
  }
</style>
