export function createTodo(
  id: number | string,
  userId: string,
  title: string,
  description: string,
  status: string,
  dueDate: string,
  createdAt: string,
  updatedAt: string,
) {
  return {
    id: id,
    userId: userId,
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
}

export interface TodoInterface {
  id: string | number;
  userId: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

type TodosArray = TodoInterface[];

export function paginate(todosList: TodosArray, length: number) {
  const paginatedTodos = [];
  for (let i = 0; i < length; i += 2) {
    const chunk = todosList.slice(i, i + 2);
    paginatedTodos.push(chunk);
  }
  return paginatedTodos;
}

export const todos = [
  {
    userId: "userId1",
    items: [
      createTodo(
        2,
        "userId1",
        "Grocery Shopping",
        "Bread, milk, apples",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
      createTodo(
        3,
        "userId1",
        "Chores",
        "Laundry, dishes",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
    ],
  },
  {
    userId: "userId2",
    items: [
      createTodo(
        "123",
        "userId2",
        "Jobhunting",
        "Resume revision, networking, company research",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
    ],
  },
  {
    userId: "49d41bdb-3da6-43f0-a623-ced157e777df",
    items: [
      createTodo(
        "123",
        "49d41bdb-3da6-43f0-a623-ced157e777df",
        "Household Shopping",
        "Soap, paper towels",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
      createTodo(
        "456",
        "49d41bdb-3da6-43f0-a623-ced157e777df",
        "Chores",
        "Laundry, dishes",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
      createTodo(
        "789",
        "49d41bdb-3da6-43f0-a623-ced157e777df",
        "Grocery Shopping",
        "Bread, milk, apples",
        "incomplete",
        "2025-11-24T00:46:52.757Z",
        "2025-11-24T00:55:10.616Z",
        "2025-11-24T00:55:10.616Z",
      ),
    ],
  },
  //297a8a9b-2fb4-46ff-9d68-4376b6d95dbb
];
