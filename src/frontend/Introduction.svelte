<StepHeader step="introduction"/>
<p>
  {$_("steps.introduction.welcome")}
</p>
<h5>
  {$_("steps.introduction.configuration.header")}
</h5>
<p>
  {$_("steps.introduction.configuration.introduction")}
</p>
<FormField>
  <Checkbox bind:checked={copyComments}/>
  <span slot="label">
    {$_("steps.introduction.configuration.copyComments.title")}
    <br/>
    {$_("steps.introduction.configuration.copyComments.description")}
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
</script>

<style lang="scss">
  @import "@material/typography/mdc-typography";

  h5 {
    @include mdc-typography('headline5');
  }
</style>
