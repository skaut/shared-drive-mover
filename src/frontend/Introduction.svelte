<p>
  {$_("steps.introduction.welcome")}
</p>
<p>
  {$_("steps.introduction.configuration.header")}
</p>
<FormField>
  <Checkbox bind:checked={copyComments}/>
  <span slot="label">
    {$_("steps.introduction.configuration.copyComments.title")}
    <br/>
    {$_("steps.introduction.configuration.copyComments.description")}
  </span>
</FormField>

<script lang="ts">
  import {_} from "svelte-i18n";
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  export let copyComments: boolean;
</script>
