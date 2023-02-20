const Product = require("../models/productModel");

//1. CREATING A PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "Success",
      data: { Product: newProduct },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

// 2. GETTING PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const queryObj = req.query;
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((ele) => delete queryObj[ele]);

    //2.1 ADVANCED FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryString));

    //2.2 SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    //2.3 FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //2.4 PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numProduct = await Product.countDocuments();
      if (skip >= numProduct) throw new Error("This page doesn't exist");
    }

    //EXECUTE QUERY
    const products = await query;
    res.send({
      status: "Success",
      results: products.length,
      data: { products },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

//3. GETTING A PRODUCT BASED ON ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      status: "Sucess",
      Product: { product },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

//4. UPDATING A PRODUCT BASED ON ID
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "Success", data: { product } });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

//DELETING A PRODUCT BASED ON ID
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};
