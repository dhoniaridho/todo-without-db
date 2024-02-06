import { add } from "./functions/math";
import Fastify, { FastifyRequest } from "fastify";
import { v4 } from "uuid";

const fastify = Fastify({
    logger: true,
});

type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

type DB = {
    todos: Todo[];
};

const db: DB = {
    todos: [],
};

// Declare a route
fastify.get("/", async function handler() {
    console.log(add(11, 10000));
    return { hello: "world" };
});

fastify.get("/todos", () => {
    return db.todos;
});

fastify.post(
    "/todos",
    {
        schema: {
            body: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    completed: { type: "boolean" },
                },
                required: ["title"],
            },
        },
    },
    (request) => {
        const todo = request.body as Todo;
        const create: Todo = {
            id: v4(),
            title: todo.title,
            completed: todo.completed,
        };
        db.todos.push(create);
        return create;
    },
);

fastify.delete(
    "/todos/:id",
    {},
    (
        request: FastifyRequest<{
            Params: {
                id: string;
            };
        }>,
        reply,
    ) => {
        const { id } = request.params;

        const todo = db.todos.find((todo) => todo.id === id);
        if (!todo) {
            reply.callNotFound();
        }

        db.todos = db.todos.filter((todo) => todo.id !== id);
        return db.todos;
    },
);

fastify.get(
    "/todos/:id",
    {},
    (
        request: FastifyRequest<{
            Params: {
                id: string;
            };
        }>,
        reply,
    ) => {
        const { id } = request.params;

        const todo = db.todos.find((todo) => todo.id === id);
        if (!todo) {
            return reply.callNotFound();
        }

        return todo;
    },
);

fastify.put(
    "/todos/:id",
    {},
    (
        request: FastifyRequest<{
            Params: {
                id: string;
            };
            Body: Pick<Todo, "title" | "completed">;
        }>,
        reply,
    ) => {
        const { id } = request.params;

        const todo = db.todos.find((todo) => todo.id === id);
        if (!todo) {
            return reply.callNotFound();
        }

        todo.title = request.body.title;
        todo.completed = request.body.completed;

        return todo;
    },
);

async function bootstrap() {
    // Run the server!
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

bootstrap();
