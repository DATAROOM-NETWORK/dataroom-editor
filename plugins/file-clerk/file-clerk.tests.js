const chai = require("chai");
const chaiHttp = require("chai-http");
const fsPromises = require("fs").promises;
const path = require("path");
const app = require('express')();  // Assuming Express is properly set up in your project
const server = require('http').Server(app);  // Create an HTTP server using the Express app
const routes_path = path.join(global.root_directory, 'routes.js');
const routes = require(routes_path)(app);
const sinon = require('sinon');


const expect = chai.expect;

chai.use(chaiHttp);

describe("File Clerk Endpoints", () => {
  describe("POST /list-notebook-pages", () => {
    it("should return an array of files in the notebook directory", async () => {
      // Stub the fsPromises.readdir function to return a predictable array of files
      sinon.stub(fsPromises, "readdir").resolves(["file1.txt", "file2.txt", "file3.txt"]);

      // Make a POST request to the endpoint
      const res = await chai.request(server).post("/list-notebook-pages");

      // Assert that the response status is 200
      expect(res.status).to.equal(200);

      // Assert that the response body is an array containing the expected file names
      expect(res.body).to.be.an("array").to.deep.equal(["file1.txt", "file2.txt", "file3.txt"]);

      // Restore the original fsPromises.readdir function
      fsPromises.readdir.restore();
    });

    it("should return a 500 error if an error occurs while listing files", async () => {
      // Stub the fsPromises.readdir function to throw an error
      sinon.stub(fsPromises, "readdir").throws("Some error");

      // Make a POST request to the endpoint
      const res = await chai.request(server).post("/list-notebook-pages");

      // Assert that the response status is 500
      expect(res.status).to.equal(500);

      // Assert that the response body contains the expected error message
      expect(res.body).to.deep.equal({ error: "Error listing files" });

      // Restore the original fsPromises.readdir function
      fsPromises.readdir.restore();
    });
  });

  describe("POST /load-notebook-page", () => {
    it("should return 'file-id is required' error if file-id is not provided", async () => {
      const res = await chai
        .request(server)
        .post("/load-notebook-page")
        .send({}); // Send an empty request body

      expect(res.status).to.equal(400);
      expect(res.body).to.deep.equal({
        error: "file-id is required in the request body",
      });
    });

    it("should return the content of the file if it exists", async () => {
      // Stub the fsPromises.readFile function to return a test content
      const readFileStub = sinon.stub(fsPromises, "readFile");
      readFileStub.resolves("Test file content");

      const res = await chai
        .request(server)
        .post("/load-notebook-page")
        .send({ "file-id": "test.prompt" });

      expect(res.status).to.equal(200);
      expect(res.body.content).to.equal("Test file content");

      readFileStub.restore(); // Restore the original function
    });

    it("should create a new file and return its content if it doesn't exist", async () => {
      // Stub the fsPromises.readFile and fsPromises.writeFile functions
      const readFileStub = sinon.stub(fsPromises, "readFile");
      const writeFileStub = sinon.stub(fsPromises, "writeFile");
      readFileStub.rejects(new Error("File not found"));
      writeFileStub.resolves();

      const res = await chai
        .request(server)
        .post("/load-notebook-page")
        .send({ "file-id": "test.missing.prompt" });

      expect(res.status).to.equal(200);
      expect(res.body.content).to.equal("Generated file content");

      readFileStub.restore(); // Restore the original functions
      writeFileStub.restore();
    });
  });
});