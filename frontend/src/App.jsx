import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [getData, setGetData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("doc", selectedFile);

      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        console.log("Successfully send");
      }
    } catch (error) {
      console.error(
        "Error uploading file:",
        error.response?.data?.error || error
      );
      toast.error(
        "Error uploading file: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      if (response.status == 200) {
        console.log(response.data);
        setGetData(response.data);
        // fetchAllData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const onClickExportData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/api/export");
  //     if (response.status == 200) {
  //       console.log(response.data);
  //       const blob = new Blob([response.data], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       const link = document.createElement("a");
  //       link.href = window.URL.createObjectURL(blob);
  //       link.download = `${Date.now()}-exported_data.xlsx`;

  //       document.body.appendChild(link);
  //       link.click();

  //       document.body.removeChild(link);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onClickExportData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/export", {
        responseType: "arraybuffer",
      });

      if (response.status === 200) {
        console.log("Response data:", response.data);

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${Date.now()}-exported_data.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    // { field: "productid", headerName: "Product ID", width: 120 },
    {
      field: "productname",
      headerName: "Product Name",
      width: 200,
      editable: true,
    },
    { field: "sku", headerName: "SKU", width: 150, editable: true },
    {
      field: "variantid",
      headerName: "Variant ID",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "discountpercentage",
      headerName: "Discount %",
      type: "number",
      width: 140,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 450,
      editable: true,
    },

    {
      field: "discountedPrice",
      headerName: "Discounted Price",
      width: 250,
      editable: true,
    },
    {
      field: "category_name",
      headerName: "Category Name",
      type: "number",
      width: 130,
      editable: true,
    },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  const deleteRecord = async (sku) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/delete/${sku}`
      );

      if (response.status == 200) {
        console.log(response.data.status);
        fetchAllData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-4">
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" disabled={!selectedFile}>
            Upload
          </button>
        </form>
        <button
          type="button"
          className="btn btn-success m-4"
          onClick={onClickExportData}
        >
          export below table
        </button>
      </div>

      <div>
        {/* <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">productname</th>
              <th scope="col">price</th>
              <th scope="col">discountpercentage</th>
              <th scope="col">sku</th>
              <th scope="col">variantid</th>
              <th scope="col">description</th>
              <th scope="col">discountedPrice</th>
              <th scope="col">category_name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {getData.map((item, idx) => {
              const {
                category_name,
                description,
                discountedPrice,
                discountpercentage,
                price,
                productname,
                sku,
                variantid,
              } = item;
              return (
                <tr key={idx}>
                  <td>{productname}</td>
                  <td>{price}</td>
                  <td>{discountpercentage}</td>
                  <td>{sku}</td>
                  <td>{variantid}</td>
                  <td>{description}</td>
                  <td>{discountedPrice}</td>
                  <td>{category_name}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => {
                        deleteRecord(sku);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={getData.map((product) => ({
              ...product,
              id: product.sku,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </div>
    </>
  );
}

export default App;
