import request from "supertest";
jest.mock("../authMiddleware.tsx", () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "userId1", iat: 1769375318, exp: 1769461718 };
    next();
  });
});
import app from "../server.tsx";
import { TodoInterface } from "../api/data/todosData.tsx";

const userInfo = {
  id: "userId1",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJJZDEiLCJpYXQiOjE3Njk1Mzg4NjgsImV4cCI6MTc2OTYyNTI2OH0.cY8o5Hr_erRFFcFNLChVQtWoYISOXH_WPJu5tGjTGPI",
  isGoogleAccount: false,
};

const cookieValue = encodeURIComponent("j:" + JSON.stringify(userInfo));

describe("POST /api/auth/signup", () => {
  it("should return 201 and register user", async () => {
    const validUser = {
      name: "Test User",
      email: "testuser@email.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(validUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ message: "User registered." });
  });

  it("should return 404 if user info is invalid", async () => {
    const invalidUser = {
      name: "First Last",
      email: "email@email.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/auth/signup")
      .send(invalidUser);
    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({
      message: "Invalid email or password.",
    });
  });
});

describe("POST /api/auth/login", () => {
  it("should return 200 on success and return cookie", async () => {
    const validUser = {
      password: "password9",
      email: "email@email.com",
    };

    const response = await request(app).post("/api/auth/login").send(validUser);
    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toContain("accessToken");
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"][0]).toContain("Secure");
  });

  it("should return 404 if user info is invalid", async () => {
    const invalidUser = {
      email: "email@email.com",
      password: "invalidpassword",
    };

    const response = await request(app)
      .post("/api/auth/login")
      .send(invalidUser);
    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({
      message: "Invalid credentials",
    });
  });
});

describe("GET /api/todos", () => {
  it("should return list of todos only belonging to the user", async () => {
    const response = await request(app)
      .get("/api/todos")
      .query({
        sortBy: "created",
        sortOrder: "asc",
        page: 1,
      })
      .set("Cookie", `accessToken=${cookieValue}`);
    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.any(Object),
        page: 1,
        limit: 2,
        total: expect.any(Number),
      })
    );
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number || String),
        userId: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        dueDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(
      response.body.items.every(
        (item: TodoInterface) => item.userId === userInfo.id
      )
    ).toEqual(true);
  });

  it("should return 401 if no access token is provided", async () => {
    const response = await request(app).get("/api/todos").query({
      sortBy: "created",
      sortOrder: "asc",
      page: 1,
    });
    expect(response.status).toEqual(401);
    expect(response.body).toStrictEqual({
      message: "Access denied.",
    });
  });
});

describe("POST /api/todos", () => {
  it("should return list with new todo", async () => {
    const date = new Date();
    const id = crypto.randomUUID();
    const testTodo = {
      title: "New Title",
      description: "Description",
      status: "incomplete",
      dueDate: date,
      createdAt: date,
      updatedAt: date,
      id: id,
    };

    const response = await request(app)
      .post("/api/todos")
      .send(testTodo)
      .set("Cookie", `accessToken=${cookieValue}`);
    expect(response.body).toEqual(
      expect.objectContaining({
        items: expect.any(Object),
        page: 1,
        limit: 2,
        total: expect.any(Number),
      })
    );
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        dueDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
    expect(response.status).toEqual(201);
  });
});

describe("GET /api/todos/:id", () => {
  it("should fetch todo belonging to the user", async () => {
    const response = await request(app)
      .get(`/api/todos/${3}`)
      .set("Cookie", `accessToken=${cookieValue}`);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: userInfo.id,
        title: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
        dueDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("should prevent user from accessing others' todo", async () => {
    const response = await request(app)
      .get("/api/todos/:id")
      .query({
        id: "123",
      })
      .set("Cookie", `accessToken=${cookieValue}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Todo not found.");
  });
});
