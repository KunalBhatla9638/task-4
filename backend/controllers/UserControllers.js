const sequelize = require("../utils/Database");
const path = require("path");
const { QueryTypes } = require("sequelize");
const { sendEmail } = require("../controllers/EmailController");

const XLSX = require("xlsx");

const welcome = (req, res) => {
  res.send("hello");
};

const uploadDoc = async (req, res) => {
  try {
    const document = req.file;
    console.log(document);
    const workbook = XLSX.readFile(
      path.join(__dirname, "../uploads/" + document.filename)
    );
    const sheet_name_list = workbook.SheetNames;
    const xlData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );
    const length = xlData.length;
    for (let i = 0; i < xlData.length; i++) {
      const data = xlData[i];
      await sequelize.query(
        `
        INSERT INTO products (productname, sku, variantid, price, discountpercentage, description, categoryid) VALUES (?, ?, ? ,? ,?, ?,?)
        `,
        {
          type: QueryTypes.INSERT,
          replacements: [
            data.productname,
            data.sku,
            data.variantid,
            data.price,
            data.discountpercentage,
            data.description,
            data.categoryid,
          ],
        }
      );
    }

    //Send the email
    sendEmail(document, length);

    res.status(200).json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const exportDoc = async (req, res) => {
  try {
    const rows = await sequelize.query(
      `SELECT p.productname, p.sku, p.variantid, p.description, c.categoryname, 
      FORMAT((p.price - (p.price * p.discountpercentage/100)),2) as discountedPrice 
      FROM products p JOIN category c ON p.categoryid = c.categoryid`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!Array.isArray(rows)) {
      res.status(404).send("No data found");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [
        "productname",
        "sku",
        "variantid",
        "description",
        "categoryname",
        "discountedPrice",
      ],
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "products");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition",
      "attachment; filename=products.xlsx"
    );

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  welcome,
  uploadDoc,
  exportDoc,
};
