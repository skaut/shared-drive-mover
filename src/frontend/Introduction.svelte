<StepHeader step="introduction" />
<p>
  {$_("steps.introduction.welcome")}
</p>
<h5>
  {$_("steps.introduction.configuration.header")}
</h5>
<p>
  {$_("steps.introduction.configuration.introduction")}
</p>
<Checkbox bind:checked={copyComments}>
  {$_("steps.introduction.configuration.copyComments.title")}
  <br/>
  {$_("steps.introduction.configuration.copyComments.description")}
</Checkbox>
<br/>
<br/>

<script lang="ts">
  import {_} from "svelte-i18n";
  import {Checkbox} from 'svelte-materialify/src';

  import StepHeader from "./StepHeader.svelte";

  export let copyComments: boolean;
</script>
