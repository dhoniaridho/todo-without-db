import { add } from "./functions/math";
import Fastify from "fastify";

const fastify = Fastify({
    logger: true,
});

// Declare a route
fastify.get("/", async function handler() {
    console.log(add(11, 10000));
    return { hello: "world" };
});

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
