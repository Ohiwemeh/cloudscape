import request from "supertest";
import mongoose from "mongoose";
import { jest } from "@jest/globals";
import app from "../server.js";
import Product from "../models/Product.js";

describe("Products API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/cloudscape-test");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe("GET /api/products", () => {
    it("should return empty array when no products exist", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all products", async () => {
      const testProduct = {
        name: "Test Product",
        price: 99.99,
        category: "Test",
        sizes: ["S", "M", "L"],
        images: ["test.jpg"],
      };

      await Product.create(testProduct);

      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe(testProduct.name);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return 404 for non-existent product", async () => {
      const res = await request(app).get(
        `/api/products/${new mongoose.Types.ObjectId()}`
      );
      expect(res.statusCode).toBe(404);
    });

    it("should return product by id", async () => {
      const product = await Product.create({
        name: "Test Product",
        price: 99.99,
        category: "Test",
        sizes: ["S", "M", "L"],
        images: ["test.jpg"],
      });

      const res = await request(app).get(`/api/products/${product._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(product.name);
    });
  });
});