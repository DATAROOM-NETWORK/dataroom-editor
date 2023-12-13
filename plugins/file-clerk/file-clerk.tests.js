const chai = require("chai");
const chaiHttp = require("chai-http");
const fsPromises = require("fs").promises;
const path = require("path");

const app = require('express')();  // Assuming Express is properly set up in your project

const server = require('http').Server(app);  // Create an HTTP server using the Express app

const routes_path = path.join(global.root_directory, 'routes.js');
console.log(routes_path);
const routes = require(routes_path)(app);


const expect = chai.expect;

chai.use(chaiHttp);

describe("File Clerk Endpoints", () => {
  let app;

  beforeEach(() => {
    // Create a new express app instance before each test
    app = express();
  });

  describe("POST /list-notebook-pages", () => {
    it("should return a list of notebook pages", async () => {
      const mockFiles = ["page1", "page2", "page3"];
      // Stub the fsPromises.readdir method to return the mock files
      fsPromises.readdir = sinon.stub().resolves(mockFiles);

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/list-notebook-pages")
        .expect(200);

      // Assert that the response contains the mock files
      expect(response.body).to.deep.equal(mockFiles);
    });

    it("should return an error if the file listing fails", async () => {
      // Stub the fsPromises.readdir method to throw an error
      fsPromises.readdir = sinon.stub().rejects(new Error("Error listing files"));

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/list-notebook-pages")
        .expect(500);

      // Assert that the response contains the error message
      expect(response.body).to.deep.equal({ error: "Error listing files" });
    });
  });

  describe("POST /load-notebook-page", () => {
    it("should return the content of an existing notebook page", async () => {
      const mockFileId = "page1";
      const mockContent = "# page1\n";

      // Stub the fsPromises.readFile method to return the mock content
      fsPromises.readFile = sinon.stub().resolves(mockContent);

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/load-notebook-page")
        .send({ "file-id": mockFileId })
        .expect(200);

      // Assert that the response contains the mock content
      expect(response.body).to.deep.equal({ content: mockContent });
    });

    it("should create a new notebook page if it does not exist", async () => {
      const mockFileId = "page2";

      // Mock the fsPromises.readFile and fsPromises.writeFile methods
      fsPromises.readFile = sinon.stub().rejects(new Error("File not found"));
      fsPromises.writeFile = sinon.stub().resolves();

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/load-notebook-page")
        .send({ "file-id": mockFileId })
        .expect(200);

      // Assert that the response contains the new page content
      const newFileContent = `---\n{
  "file-id":"${mockFileId}",
  "date-created":"${new Date()}",
  "last-updated":"${new Date()}"
}\n---\n\n# ${mockFileId}\n`;
      expect(response.body).to.deep.equal({ content: newFileContent });
    });

    it("should return an error if the file read/write fails", async () => {
      const mockFileId = "page3";

      // Stub the fsPromises.readFile method to throw an error
      fsPromises.readFile = sinon.stub().rejects(new Error("Error reading file"));

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/load-notebook-page")
        .send({ "file-id": mockFileId })
        .expect(500);

      // Assert that the response contains the error message
      expect(response.body).to.deep.equal({ error: "Error reading file" });
    });
  });

  // ... (similar updates for other test suites)

  describe("POST /save-file", () => {
    it("should save the file and return a success message", async () => {
      const mockFileId = "page1";
      const mockFilePath = path.join(
        global.root_directory,
        "notebook",
        mockFileId,
      );
      const mockContent = "Some content";

      // Stub the fsPromises.writeFile method to resolve without an error
      fsPromises.writeFile = sinon.stub().resolves();

      // Make a request to the endpoint
      const response = await chai
        .request(app)
        .post("/save-file")
        .send({ "file-id": mockFileId, content: mockContent })
        .expect(200);

      // Assert that the response contains the success message
      expect(response.body).to.deep.equal({
        message: "File saved successfully",
      });

      // Assert that the fsPromises.writeFile method was called with the correct arguments
      expect(fsPromises.writeFile).to.have.been.calledWith(
        mockFilePath,
        mockContent,
        "utf8"
      );
    });

    // ... (similar updates for other test cases)
  });
});

