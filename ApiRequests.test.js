const app = require("./app");
const supertest = require("supertest");
const request = supertest(app);

it("Gets the /api/ping endpoint with status code 200 and {success: true}", async (done) => {
  const response = await request.get("/api/ping");
  expect(response.body.success).toBe(true);
  expect(response.status).toBe(200);
  done();
});

it("When /api/posts endpoint is called, if tags query is missing, return 400 and error message", async (done) => {
  const response = await request.get("/api/posts?sortBy=likes&direction=desc");
  expect(response.body.error).toBe("Tags parameter is required");
  expect(response.status).toBe(400);
  done();
});

it("When /api/posts endpoint is called, if sortBy query is invalid, return 400 and error message", async (done) => {
  const response = await request.get(
    "/api/posts?tags=history,tech&sortBy=likes1&direction=desc"
  );
  expect(response.body.error).toBe("sortBy parameter is invalid");
  expect(response.status).toBe(400);
  done();
});

it("When /api/posts endpoint is called, if direction query is invalid, return 400 and error message", async (done) => {
  const response = await request.get(
    "/api/posts?tags=history,tech&sortBy=likes&direction=desc1"
  );
  expect(response.body.error).toBe("direction parameter is invalid");
  expect(response.status).toBe(400);
  done();
});

it("When /api/posts endpoint is successfully called, first option when ascending matches", async (done) => {
  const response = await request.get(
    "/api/posts?tags=history,tech&sortBy=likes&direction=asc"
  );
  expect(response.body.posts[0].id).toBe(85);
  expect(response.status).toBe(200);
  done();
});

it("When /api/posts endpoint is successfully called, first option when descending matches", async (done) => {
  const response = await request.get(
    "/api/posts?tags=history,tech&sortBy=likes&direction=desc"
  );
  expect(response.body.posts[0].id).toBe(95);
  expect(response.status).toBe(200);
  done();
});
