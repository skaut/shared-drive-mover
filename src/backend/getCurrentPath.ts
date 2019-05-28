export default function(path: Array<Folder>): Array<Folder>
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
				fields: 'title'
			});
			ret.push({id: segment.id!, name: response.title!});
		}
	}
	return ret;
}

