import request from "supertest";
import app from "..server/";

describe("GET /api/auth/todos", () => {
  it("todos sent", async () => {
    const res = await request(app).get("/api/auth/todos");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("");
  });
});
