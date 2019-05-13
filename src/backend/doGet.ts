export default function(): GoogleAppsScript.HTML.HtmlOutput
{
	return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Shared Drive Mover');
};
