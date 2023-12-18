import "./file-clerk.interface.notebook-pages.js";


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

export { getNotebookPage };

