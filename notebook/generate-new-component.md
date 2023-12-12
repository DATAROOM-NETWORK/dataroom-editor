---
{"date-created":"Tue Dec 12 2023 11:17:16 GMT-0800 (Pacific Standard Time)","file-id":"generate-new-component","last-updated":"2023-12-12T21:55:10.906Z"}
---
<generate-new-component 
  id="4334762d-3197-4aa3-a170-4fa971d39865"
>
</generate-new-component>


```js

    const file_exists = await fetch(`/file-exists?&file-id=${this.id}`).then(res => res.json());

    if(file_exists){
      this.innerHTML = `<mark-down src="/${this.id}.md"></mark-down>`;
      return
    }


```
