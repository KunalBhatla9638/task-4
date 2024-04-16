const { QueryTypes } = require("sequelize");
const sequelize = require("../utils/Database");

const listProducts = async (req, res) => {
  try {
    const products = await sequelize.query(
      `
      SELECT p.productname, p.price, p.discountpercentage, p.sku,
      p.variantid, p.description, FORMAT((p.price - (p.price * p.discountpercentage/100)),2) as discountedPrice,
      c.categoryname as category_name FROM products p JOIN category c ON p.categoryid = c.categoryid;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProducts = async (req, res) => {
  const sku = req.params.sku;
  console.log(sku);
  try {
    const [checkSku] = await sequelize.query(
      "select * from products where sku = ?",
      {
        type: QueryTypes.SELECT,
        replacements: [sku],
      }
    );

    if (checkSku == undefined) {
      return res.status(404).json({ error: "Product not found" });
    }

    await sequelize.query("delete from products where sku = ?", {
      type: QueryTypes.DELETE,
      replacements: [sku],
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  listProducts,
  deleteProducts,
};
