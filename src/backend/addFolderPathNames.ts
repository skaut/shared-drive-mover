export default function(path: Array<NamedRecord>): Array<NamedRecord>
{
	let ret = [];
	for(let segment of path)
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
			ret.push({id: segment.id!, name: response.title!});
		}
	}
	return ret;
}

