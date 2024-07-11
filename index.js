import { counterComponent } from "./app-component.js";
import { createApp } from "./app.js";
import { h, hFragment, hString } from "./h.js";

function TodoItem(todo, i, emit) {
  return h("li", { class: "todo-item", action: "submit" }, [
    TodoInReadMode(todo, i, emit),
  ]);
}

// function TodoInEditMode(todo) {
//   return h("p", {}, [todo]);
// }

function TodoDeleteButton(index, emit) {
  return h(
    "button",
    {
      on: {
        click: () => {
          emit("delete", index);
        },
      },
    },
    ["DELETE"],
  );
}

function TodoInReadMode(todo, i, emit) {
  return h("p", { type: `todo-${i}`, name: "user" }, [
    todo,
    TodoDeleteButton(i, emit),
  ]);
}

function TodoLists(state, emit) {
  return h(
    "ul",
    {},
    state?.todos?.map((todo, i) => TodoItem(todo?.text, i, emit)),
  );
}

const state = { todos: [], currentTodoItem: "" };

const reducers = {
  submit: (state) => {
    const newState = {
      ...state,
      currentTodoItem: "",
      todos: [...state.todos, { text: state.currentTodoItem }],
    };

    return newState;
  },
  currentTodo: (state, payload) => {
    return {
      ...state,
      currentTodoItem: payload,
    };
  },

  delete: (state, payload) => {
    const todos = state.todos;
    todos.splice(payload, 1);

    return {
      ...state,
      todos,
    };
  },
};

function CreateTodos(_state, emit) {
  return h(
    "div",
    {
      class: "todo-form",
    },
    [
      h("input", {
        type: "text",
        name: "todo",
        value: _state.currentTodoItem,
        on: {
          input: (event) => {
            emit("currentTodo", event.target.value);
          },
          keydown: ({ key }) => {
            if (key === "Enter") emit("submit", _state.currentTodoItem);
          },
        },
      }),
      h(
        "button",
        {
          on: {
            click: () => {
              emit("submit");
            },
          },
        },
        ["Submit"],
      ),
    ],
  );
}

function TodoAppView(state, emit) {
  return hFragment([
    h("h1", {}, ["MY TODOS"]),
    CreateTodos(state, emit),
    TodoLists(state, emit),
  ]);
}
// const app = createApp({ state, view: TodoAppView, reducers });
// app.mount(document.getElementById("id"));

counterComponent.mount(document.getElementById("id"));
// const todoApp = AppState({
//   todos: [
//     {
//       text: "Test1",
//     },
//     {
//       text: "Test1",
//       isEditing: true,
//     },
//   ],
// });

// const reducers = {
//   add: (state) => {
//     return { count: state.count + 1 };
//   },
//   sub: (state) => ({ count: state.count - 1 }),
// };
//
// function View(state, emit) {
//   return hFragment([
//     h("button", { on: { click: () => emit("sub") } }, ["-"]),
//     h("span", { class: `${state.count < 0 ? "negative" : "positive"}` }, [
//       hString(state.count),
//     ]),
//     h("button", { on: { click: () => emit("add") } }, ["+"]),
//   ]);
// }

// setTimeout(() => {
//   console.log(app.getState(state));
// }, 5000);
