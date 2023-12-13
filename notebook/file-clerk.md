---
{
  "file-id":"file-clerk.md",
  "date-created":"Wed Dec 13 2023 09:05:54 GMT-0800 (Pacific Standard Time)",
  "last-updated":"Wed Dec 13 2023 09:05:54 GMT-0800 (Pacific Standard Time)"
}
---

# file-clerk.md




## Get notebook page example

```js

async function getNotebookPage(file_id){
  const response = await fetch("/load-notebook-page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"file-id":file_id})
  });
  const data = response.json();
  return data;
}

getNotebookPage('index.md').then(res => {
  console.log(res);
})

```

## Tests

#file-clerk.list-notebooks.tests.prompt
#file-clerk.load-notebook-page.tests.prompt
#file-clerk.hanging.tests.prompt