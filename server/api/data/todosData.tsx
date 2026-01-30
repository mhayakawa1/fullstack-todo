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
];
