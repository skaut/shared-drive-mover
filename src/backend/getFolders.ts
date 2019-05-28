import getCurrentPath from './getCurrentPath';
import getFolderList from './getFolderList';

export default function(path: Array<Folder>): PathResponse
{
	const root = path.length === 0 ? 'root' : path[path.length - 1].id;
	return {path: getCurrentPath(path), children: getFolderList(root)};
};
