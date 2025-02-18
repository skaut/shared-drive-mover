<script lang="ts">
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";

  import * as m from "./paraglide/messages";
  import StepHeader from "./StepHeader.svelte";

  interface Props {
    copyComments: boolean;
    mergeFolders: boolean;
  }

  let { copyComments = $bindable(), mergeFolders = $bindable() }: Props =
    $props();
</script>

<StepHeader>
  {m.introduction_header()}
</StepHeader>
<p>
  {m.introduction_welcome()}
</p>
<h5>
  {m.introduction_configuration_header()}
</h5>
<FormField>
  <Checkbox bind:checked={copyComments} />
  {#snippet label()}
    <div class="form-heading">
      {m.introduction_configuration_copyComments_title()}
    </div>
    {m.introduction_configuration_copyComments_description()}
  {/snippet}
</FormField>
<br />
<br />
<FormField>
  <Checkbox bind:checked={mergeFolders} />
  {#snippet label()}
    <div class="form-heading">
      {m.introduction_configuration_mergeFolders_title()}
    </div>
    {m.introduction_configuration_mergeFolders_description()}
  {/snippet}
</FormField>
<br />
<br />

<style lang="scss">
  @use "@material/typography/mixins" as typography;

  h5 {
    @include typography.typography("headline5");
  }

  .form-heading {
    @include typography.typography("subtitle2");
  }
</style>
