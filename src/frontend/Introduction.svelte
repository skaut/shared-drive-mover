<p>
  welcome.text
</p>
<p>
  config.header
</p>
<FormField>
  <Checkbox bind:checked={copyComments}/>
  <span slot="label">
    copy.title
    <br/>
    copy.description
  </span>
</FormField>

<script lang="ts">
  import FormField from "@smui/form-field";
  import Checkbox from "@smui/checkbox";

  export let copyComments: bool;
</script>
