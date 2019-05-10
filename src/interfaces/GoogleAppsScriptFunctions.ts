interface GoogleAppsScriptFunctions extends PublicEndpoints
{
	withSuccessHandler(fn: Function): GoogleAppsScriptFunctions;
	withFailureHandler(fn: Function): GoogleAppsScriptFunctions;
}
