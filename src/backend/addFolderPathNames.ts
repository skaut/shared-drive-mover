/* exported addFolderPathNames */

function addFolderPathNames(path: Array<NamedRecord>): Array<NamedRecord>
{
	const ret = [];
	for(const segment of path)
	{
		if(segment.name)
		{
			ret.push(segment);
		}
		else
		{
			const response = Drive.Files!.get(segment.id, {
				fields: 'title',
				supportsAllDrives: true
			});
			ret.push({id: segment.id, name: response.title!});
		}
	}
	return ret;
}

