import assert from "node:assert/strict";
import test from "node:test";

import { z } from "zod";

import { validate } from "../src/validators/zodValidator.js";

const createResponse = () => ({
  statusCode: undefined,
  body: undefined,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test("validation middleware passes parsed request data to the next handler", async () => {
  const req = { body: { count: "3" } };
  const res = createResponse();
  let nextCalled = false;

  await validate(z.object({ count: z.coerce.number() }))(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, { count: 3 });
});

test("validation middleware returns a bad request for invalid input", async () => {
  const req = { body: { email: "not-an-email" } };
  const res = createResponse();
  let nextCalled = false;

  await validate(z.object({ email: z.email() }))(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /validation error/);
  assert.equal(nextCalled, false);
});
