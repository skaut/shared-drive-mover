global.getFolders = function(path)
{
  if(path.length === 0)
  {
    root = 'root';
  }
  else
  {
    root = path[path.length - 1].id;
  }
  return {path: getCurrentPath_(path), folders: getFolderList_(root)};
};

function getCurrentPath_(path)
{
  var ret = [];
  for(var i in path)
  {
    if(path[i].name)
    {
      ret.push(path[i]);
    }
    else
    {
      var response = Drive.Files.get(path[i].id, {
        fields: 'title'
      });
      ret.push({id: path[i].id, name: response.title});
    }
  }
  return ret;
}

function getFolderList_(root)
{
  var ret = [];
  pageToken = null;
  do
  {
    var response = Drive.Files.list({
      q: '"' + root + '" in parents and mimeType = "application/vnd.google-apps.folder" and trashed = false',
      pageToken: pageToken,
      maxResults: 1000,
      fields: 'nextPageToken, items(id, title)'
    });
    for(var i in response.items)
    {
      ret.push({id: response.items[i].id, name: response.items[i].title});
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  return ret;
}

global.getSharedDrives = function()
{  
  var ret = [];
  pageToken = null;
  do
  {
    var response = Drive.Drives.list({
      pageToken: pageToken,
      maxResults: 100,
      fields: 'nextPageToken, items(id, name)'
    });
    for(var i in response.items)
    {
      ret.push({id: response.items[i].id, name: response.items[i].name});
    }
    pageToken = response.nextPageToken;
  } while (pageToken !== undefined);
  return ret;
};

global.doGet = function() {
  return HtmlService.createTemplateFromFile('index')
  .evaluate()
  .setTitle('Shared Drive Mover');
};
