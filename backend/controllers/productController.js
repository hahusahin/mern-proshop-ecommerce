import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource Not Found");
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: "Sample name",
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    description: "Sample description",
    numReviews: 0,
    price: 0,
    countInStock: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/ADMIN
const updateProduct = asyncHandler(async (req, res) => {
  const { name, image, brand, category, description, price, countInStock } =
    req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource Not Found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/ADMIN
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource Not Found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
